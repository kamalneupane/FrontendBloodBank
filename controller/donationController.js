const Donation = require('../models/donation')
const Blood = require('../models/blood')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')


exports.showDonationForm = catchAsyncErrors ( async (req,res) => {
    const bloods = await Blood.find();
    if(!bloods){
        return next(new ErrorHandler('No blood found', 404))
    }
    res.render('backend/donar/donateform',{ 
        user: req.user,
        bloods
    })
})
// New Donation Request => donation/new
exports.newDonation = catchAsyncErrors(async (req, res, next) => {
    const id = req.body.blood;
    const bloodname = await Blood.findById(id);
    const donateGroup = 
        { 
            name: bloodname.name,
            blood: id,
            units: req.body.units
        }
    ;
    

    const {
        age,
        disease,
        phone,
        address
    } = req.body;
    
    const donation = await Donation.create({
        donateGroup,
        age,
        disease,
        phone,
        address,
        user: req.user._id
    })
    res.redirect('/donations/me')
});
// get single donation => donation/:id
exports.getSingleDonation = catchAsyncErrors(async(req, res, next) => {
    const donation = await Donation.findById(req.params.id).populate('user','name email');

    if(!donation){
        return next(new ErrorHandler('Donation blood not found with this id',404))
    }
    res.status(200).json({
        success: true,
        donation
    })
});
// get loggedIn user donations => donations/me
exports.myDonations = catchAsyncErrors(async(req, res, next) => {
    const donations = await Donation.find({ user: req.user.id });

    res.render('backend/donar/donationhistory', {
        donations
    })
})
// get all donations => admin/donations
exports.allDonations = catchAsyncErrors( async(req, res, next) => {
    const donations = await Donation.find({ status:'Processing' }).populate('user', 'name email');
    res.render('backend/admin/donationlist',{
        donations
    })
})
// donation history => admin/donations/history
exports.donationHistory = catchAsyncErrors(async (req, res, next) => {
    const donations = await Donation.find({ status: 'approved' }).populate('user','name email');
    res.render('backend/admin/donationhistory',{
        donations
    })
})
// update donation => admin/donation/:id
exports.updateDonation = catchAsyncErrors(async(req, res, next) => {
    const donation = await Donation.findById(req.params.id);
    if(!donation){
        return next(new ErrorHandler('Donation not found with this id', 404))
    }
    if(donation.status === 'approved'){
        return next(new ErrorHandler('You have already respond this donation request'))
    }
    const  id = donation.donateGroup.blood
    const unit = donation.donateGroup.units

    updateBlood(id, unit);

    // donation.donateGroup.forEach(async item => {
    //     await updateBlood(item.blood, item.units);
    // })

    donation.status = req.body.status
    await donation.save();

    res.redirect('/admin/donations/history')
})

async function updateBlood(id, units){
    const blood = await Blood.findById(id);
    blood.units = blood.units + units

    await blood.save({
        validateBeforeSave: false
    });
}

// Delete donation request => admin/donation/:id
exports.deleteDonation = catchAsyncErrors(async (req, res, next) => {
    const donation = await Donation.findById(req.params.id);
    if(!donation){
        return next(new ErrorHandler('Donation not found', 404))
    }
    await donation.remove();
    res.status(200).json({
        success: true
    })
})