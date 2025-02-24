import {Request, Response} from 'express';

class HomeController {
    static home(req:Request, res:Response){
        res.status(200).json({
            status: 'success',
            message: 'Welcome to the GluGuide API!'
        });
    };
}

export default HomeController;