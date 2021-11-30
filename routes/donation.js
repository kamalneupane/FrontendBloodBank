const express = require('express');
const router = express.Router();
const { 
    newDonation, 
    getSingleDonation, 
    myDonations, 
    allDonations, 
    updateDonation, 
    deleteDonation, 
    showDonationForm,
    donationHistory
} = require('../controller/donationController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route('/donar/donation').get(isAuthenticatedUser, showDonationForm)
router.route('/donation/new').post(isAuthenticatedUser, newDonation)
router.route('/donation/:id').get(isAuthenticatedUser, getSingleDonation)
router.route('/donations/me').get(isAuthenticatedUser, myDonations)
router.route('/admin/donations').get(isAuthenticatedUser, authorizeRoles('admin'), allDonations);
router.route('/admin/donations/history').get(isAuthenticatedUser,authorizeRoles('admin') ,donationHistory)
router.route('/admin/donation/:id')
                .put(isAuthenticatedUser, authorizeRoles('admin'), updateDonation)
                .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteDonation)

module.exports = router