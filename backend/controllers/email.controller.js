import agenda from "../config/agenda.js";

const saveFlow = async (req, res) => {
    const { nodes } = req.body;

    for (const node of nodes) {
        if (node.type === 'coldEmail') {
            const { subject, body } = node.data;
            
            const emailSource = nodes.find(node => node.type === 'leadSource');
            const delayNode = nodes.find(node => node.type === 'waitDelay');

            const email = emailSource ? emailSource.data.source : "";
            const delay = delayNode ? delayNode.data.delay : 0;

            const delayDate = new Date(Date.now() + delay * 60000);
            
            await agenda.schedule(delayDate, 'send email', { to: email, subject, body });
        }
    }

    res.status(200).json({ message: 'Flow saved and emails scheduled' });
};

export default saveFlow;