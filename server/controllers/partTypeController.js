import db from '../database/db.js';

const addPartType = async (req, res) => {
    const { typeName } = req.body;

    if (!typeName) {
        return res.status(400).json({ success: false, message: 'Part Type is required' });
    }

    try {
        await db.execute('INSERT INTO part_types (type_name) VALUES (?)', [typeName]);
        res.json({ success: true, message: 'Part Type added successfully' });
    } catch (error) {
        console.error('Error adding part type:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const getPartTypes = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM part_types ORDER BY id ASC');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching part types:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const updatePartType = async (req, res) => {
    const { id } = req.params;
    const { typeName } = req.body;

    if (!typeName) {
        return res.status(400).json({ success: false, message: 'Part Type is required' });
    }

    try {
        await db.execute('UPDATE part_types SET type_name = ? WHERE id = ?', [typeName, id]);
        res.json({ success: true, message: 'Part Type updated successfully' });
    } catch (error) {
        console.error('Error updating part type:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export default { addPartType, getPartTypes, updatePartType };
