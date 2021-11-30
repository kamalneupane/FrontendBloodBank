const express = require('express');
const router = express.Router();

const { 
    newRequest, 
    getSingleRequest,
    myRequest,
    allRequest,
    updateRequest,
    deleteRequest,
    showRequestForm,
    requestHistory
} = require('../controller/requestController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route('/donar/request').get(isAuthenticatedUser, showRequestForm)
router.route('/request/new').post(isAuthenticatedUser, newRequest)
router.route('/request/:id').get(isAuthenticatedUser, getSingleRequest)
router.route('/requests/me').get(isAuthenticatedUser, myRequest)
router.route('/admin/requests').get(isAuthenticatedUser, authorizeRoles('admin'), allRequest)
router.route('/admin/requests/history').get(isAuthenticatedUser, authorizeRoles('admin'), requestHistory)
router.route('/admin/request/:id')
                                .put(isAuthenticatedUser, authorizeRoles('admin'), updateRequest)
                                .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteRequest)



module.exports = router