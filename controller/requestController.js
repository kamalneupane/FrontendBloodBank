const Request = require('../models/request')
const Blood = require('../models/blood')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')

exports.showRequestForm = catchAsyncErrors ( async (req,res) => {
    const bloods = await Blood.find();
    if(!bloods){
        return next(new ErrorHandler('No blood found', 404))
    }
    res.render('backend/donar/requestform',{ 
        user: req.user,
        bloods
    })
})

// create new request => request/new
exports.newRequest = catchAsyncErrors(async(req, res, next) => {
    const id = req.body.blood;
    const bloodname = await Blood.findById(id);

    const requestGroup = {
        name: bloodname.name,
        blood: id,
        units: req.body.units
    }
    const { 
        age,
        reason,
        phone,
        address
    } = req.body;

    const request = await Request.create({
        requestGroup,
        age,
        reason,
        phone,
        address,
        user: req.user._id
    });
    res.redirect('/requests/me')
});

// get single request => request/:id
exports.getSingleRequest = catchAsyncErrors( async (req, res, next) => {
    const request = await Request.findById(req.params.id).populate('user','name email')

    if(!request){
        return next( new ErrorHandler('No request made with this ID', 404))
    }
    res.status(200).json({
        success: true,
        request
    })
})
// get logged in user request => requests/me
exports.myRequest = catchAsyncErrors( async (req, res, next) => {
    const requests = await Request.find({ user: req.user.id })

    res.render('backend/donar/requesthistory', {
        requests
    })
})
// get all request => admin/requests
exports.allRequest = catchAsyncErrors( async (req, res, next) => {
    const requests = await Request.find({ status: 'Processing'}).populate('user','name email');

    res.render('backend/admin/requestlist', {
        requests
    })
})
// request history => admin/requests/history
exports.requestHistory = catchAsyncErrors(async (req, res, next) => {
    const requests = await Request.find({ status: 'approved'}).populate('user','name email')
    res.render('backend/admin/requesthistory',{
        requests
    })
})

// update/process request => admin/order/:id
exports.updateRequest = catchAsyncErrors( async( req, res, next) => {
    const request = await Request.findById(req.params.id);
    if(request.status === 'approved'){
        return next(new ErrorHandler('You have already respond this request',400))
    }

    const  id = request.requestGroup.blood
    const unit = request.requestGroup.units

    updateBlood(id, unit)

    // request.requestGroup.forEach(async item => {
    //     await updateBlood(item.blood, item.units);
    // })

    request.status = req.body.status

    await request.save();

    res.redirect('/admin/requests/history')
})

async function updateBlood(id, units){
    const blood = await Blood.findById(id);
    blood.units = blood.units - units

    await blood.save({
        validateBeforeSave: false
    });
}

// Delete Request => admin/request/:id
exports.deleteRequest = catchAsyncErrors(async (req, res, next) => {
    const request = await Request.findById(req.params.id);
    if(!request){
        return next( new ErrorHandler('Request Not found', 404))
    }
    await request.remove();

    res.status(200).json({
        success: true
    })
})