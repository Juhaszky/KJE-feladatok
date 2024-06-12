const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
    Object.entries(columnMap).forEach(([columnNumber, columnValue]) => {
        const originalValues = [...columnValue].reverse();
        console.log('beforeswap', originalValues);
        const swapNumber = getAvailabelSwapAmount(columnValue);
        if (swapNumber > 0) {
            let swapCounter = 0;
            const swapHelperMap = getSwapHelperMap(originalValues);
            if (canSwap(swapHelperMap)) {
                const mapEntries = Array.from(swapHelperMap.entries());
                for (let i = 0; i < mapEntries.length - 1; i++) {
                    let tmpValues = [...originalValues];
                    const [currentValue, swapIndexes] = mapEntries[i];
                    const [nextValue, nextValueIndexes] = mapEntries[i + 1];

                    nextValueIndexes.forEach(index => {
                        tmpValues[index] = currentValue;
                    });

                    swapCounter++
                    const tmpResult = columnMap;
                    tmpResult[columnNumber] = tmpValues;
                    console.log(tmpResult)
                }
            };
        }
        console.log('afterswap', originalValues);
    });
};

const canSwap = (helper) => {
    return helper.size > 1;
}

const getAvailabelSwapAmount = (colValues) => {
    const swapAmount = new Set(colValues);
    return swapAmount.size - 1;
}

const getSwapHelperMap = (colValues) => {
    const swapMap = new Map();
    for (let i = 0; i < colValues.length; i++) {
        if (swapMap.has(colValues[i])) {
            swapMap.get(colValues[i]).push(i);
        } else {
            swapMap.set(colValues[i], [i]);
        }

    }
    return swapMap;
};


module.exports = router;
