const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/* GET users listing. */
router.post('/upload', upload.single('file'), (req, res, next) => {
    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[1];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet);
        const columnMapping = getPlainColumnMap(jsonData);
        startNinetyNineMethod(columnMapping);
        //getSwapOptions(columnMapping);
        res.send(columnMapping);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to process the uploaded file' });
    }
});

const getPlainColumnMap = (jsonData) => {
    const colMap = new Map();
    jsonData.forEach((row, rowIndex) => {
        Object.entries(row).forEach(([rowHeader, rowValue], rowDataIdx) => {
            if (rowDataIdx === 0 || rowDataIdx === 12) return;
            if (colMap.has(rowDataIdx)) {
                colMap.get(rowDataIdx).push(rowValue);
            } else {
                colMap.set(rowDataIdx, [rowValue]);
            }
        })
    });
    const plainColumnMap = Object.fromEntries(colMap);
    return plainColumnMap;
}
const startNinetyNineMethod = (columnMap) => {
    const columnValuesAfterSwap = [];
    Object.entries(columnMap).forEach(([columnNumber, columnValue]) => {
        const originalValues = columnValue.reverse();
        console.log('beforeswap', originalValues);
        const swapNumber = getSwapOptionsForColumn(columnValue);
        if (swapNumber > 0) {
            let swapCounter = 0;
            originalValues.forEach((value, index) => {
                const numToSwap = value;
                if (haveSwapPairs(originalValues, numToSwap)) {
                    //TODO: Improve swap logic here
                    
                    // originalValues.forEach((value, index) => {
                    //     if (swapCounter === swapNumber) return;
                    //     if (value === numToSwap + 1) { // Check if the value is one more than its index
                    //         originalValues[index] = numToSwap; // Swap the value to its preceding value
                    //         swapCounter++;
                    //     }
                    // });
                };
            });
        }

        console.log('afterswap', originalValues);
    });
};
const haveSwapPairs = (values, forSwap) => {
    return values.includes(forSwap + 1);
}

const getSwapOptionsForColumn = (colValues) => {
    const swapAmount = new Set(colValues);
    return swapAmount.size - 1;
}

module.exports = router;
