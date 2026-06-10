const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // lowercase आणि uppercase दोन्ही प्रकारचे Authorization headers रीड करणे (Axios सुसंगततेसाठी)
    const authHeader = req.header('Authorization') || req.header('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "No token, authorization denied!" });
    }

    // FIXED: split केल्यावर येणाऱ्या ॲरेमधील [1] इंडेक्सचे ॲक्च्युअल टोकन घेणे
    const token = authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ success: false, message: "Token missing after Bearer prefix!" });
    }

    try {
        // Token verify करणे
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Request object मध्ये userId ॲड करणे
        req.userId = decoded.userId;
        
        next(); // पुढच्या फंक्शनकडे (Controller) जाणे
    } catch (error) {
        res.status(401).json({ success: false, message: "Token is not valid!", error: error.message });
    }
};

module.exports = authMiddleware;