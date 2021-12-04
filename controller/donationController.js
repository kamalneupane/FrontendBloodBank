const Donation = require('../models/donation')
const Blood = require('../models/blood')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')
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
    req.flash('message','Donation request made successfully')
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
        donations,
        message: req.flash('message')
    })
})
// get all donations => admin/donations
exports.allDonations = catchAsyncErrors( async(req, res, next) => {
    const donations = await Donation.find({ status:'Processing' }).populate('user', 'name email');
    res.render('backend/admin/donationlist',{
        donations
    })
})
// get approved donations => donar/donations?keyword:address
exports.allDonationsDonar = catchAsyncErrors(async (req, res, next) => {
    const apiFeatures = new APIFeatures(Donation.find({ status: 'approved' }).populate('user', 'name'), req.query)
                        .search()
    const donations = await apiFeatures.query;
    res.render('backend/donar/search', {
        donations
    })
    // res.status(200).json({
    //     count: donations.length,
    //     donations
    // })
})

// donation history => admin/donations/history
exports.donationHistory = catchAsyncErrors(async (req, res, next) => {
    const donations = await Donation.find({ status : ['rejected' , 'approved'] }).populate('user','name email');
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

    if(req.body.status === 'rejected'){
        donation.status = req.body.status;
        await donation.save();
        return res.redirect('/admin/donations/history')
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
    res.redirect('/admin/donations')
})