const List = require('../models/list');
const Agent = require('../models/agent');
const xlsx = require("xlsx");
const fs = require("fs");
const csv = require('csv-parser');

const listController = {
    uploadList: async (req, res) => {
        try {
            const filePath = req.file.path;
            const ext = filePath.split('.').pop().toLowerCase();
    
            // Validate file extension
            if (!['csv', 'xlsx', 'xls'].includes(ext)) {
                fs.unlinkSync(filePath);  // Remove the invalid file
                return res.status(400).json({ message: "Invalid file type. Only CSV, XLSX, and XLS files are accepted." });
            }
    
            let data = [];
    
            // Read CSV File
            if (ext === 'csv') {
                data = await new Promise((resolve, reject) => {
                    const results = [];
                    let isValidFormat = true;
    
                    fs.createReadStream(filePath)
                        .pipe(csv())
                        .on('headers', (headers) => {
                            // Check if the headers are in the correct format
                            const requiredHeaders = ['FirstName', 'Phone', 'Notes'];
                            const hasAllHeaders = requiredHeaders.every(header => headers.includes(header));
    
                            if (!hasAllHeaders) {
                                isValidFormat = false;
                                reject(new Error("Invalid CSV format. The file must contain 'FirstName', 'Phone', and 'Notes' columns."));
                            }
                        })
                        .on('data', (row) => {
                            if (isValidFormat && row.FirstName && row.Phone) {
                                results.push({
                                    firstName: row.FirstName,
                                    phone: parseInt(row.Phone),
                                    notes: row.Notes || ''
                                });
                            }
                        })
                        .on('end', () => resolve(results))
                        .on('error', (err) => reject(err));
                });
            } 
            // Read Excel File (xlsx/xls)
            else if (ext === 'xlsx' || ext === 'xls') {
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
                // Validate Excel Headers
                const requiredHeaders = ['FirstName', 'Phone', 'Notes'];
                const headers = Object.keys(jsonData[0] || {});
    
                const hasAllHeaders = requiredHeaders.every(header => headers.includes(header));
                if (!hasAllHeaders) {
                    fs.unlinkSync(filePath);  // Remove the invalid file
                    return res.status(400).json({ message: "Invalid Excel format. The file must contain 'FirstName', 'Phone', and 'Notes' columns." });
                }
    
                data = jsonData;
            }
    
            // Validation for Empty Data
            if (!data || data.length === 0) {
                fs.unlinkSync(filePath);  // Remove the empty file
                return res.status(400).json({ message: "Invalid or empty file" });
            }
    
            // Get All Agents
            const agents = await Agent.find();
            const agentCount = agents.length;
    
            if (agentCount === 0) {
                fs.unlinkSync(filePath);  // Remove the file if no agents are found
                return res.status(400).json({ message: "No agents available." });
            }
    
            // Distribute the Data Equally Among Agents
            const distributedLists = [];
            data.forEach((item, index) => {
                const agentIndex = index % agentCount;
                distributedLists.push({ ...item, agentId: agents[agentIndex]._id });
            });
    
            // Save Distributed Data
            await List.insertMany(distributedLists);
            fs.unlinkSync(filePath);  // Delete the file after processing
    
            res.status(201).json({ message: 'List uploaded and distributed successfully', distributedLists });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },    
    getAgentLists: async (req, res) => {
        try {
            const lists = await List.find().populate('agentId', 'name email mobileNumber');
            res.status(200).json({ lists });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = listController;
