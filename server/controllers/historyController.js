const db = require('../models');
const {borrow, book} = require('../models');
const History = db.History;
// List all history records
exports.index = async (req, res) => {
    try {
        const histories = await History.findAll({
        include: [
            {
            model: borrow,
            as: 'borrow',
            include: [
                {
                model: book,
                as: 'book'
                }
            ]
            }
        ]
        });
    
        res.json(histories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve history records.' });
    }
}
//get single history by ID
exports.show = async (req, res) => {
    try {
        const history = await History.findByPk(req.params.id, {
        include: [
            {
            model: borrow,
            as: 'borrow',
            include: [
                {
                model: book,
                as: 'book'
                }
            ]
            }
        ]
        });
    
        if (!history) {
        return res.status(404).json({ message: 'History not found' });
        }
    
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve history.' });
    }
};
//show history automatically when a borrow is created
exports.store = async (req, res) => {
    try {
        const { borrow_id, status } = req.body;

        if (!borrow_id || !status) {
            return res.status(400).json({ message: 'Borrow ID and status are required.' });
        }

        const history = await History.create({
            borrow_id,
            status,
            change_date: new Date()
        });

        res.status(201).json({
            message: 'History created successfully',
            history
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create history record.', error: error.message });
}
};