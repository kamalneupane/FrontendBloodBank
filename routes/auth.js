const express = require('express')
const router = express.Router()
const { 
    registerUser, 
    loginUser, 
    logoutUser, 
    forgotPassword, 
    resetPassword, 
    getUserProfile,
    updatePassword,
    updateProfile,
    getAllUsers,
    getUserDetails,
    updateUser,
    deleteUser,
    showLoginPage,
    showRegisterPage,
    showDonarDashboard,
    showAdminDashboard,
    editUser,
    forgotPasswordForm,
    resetPasswordForm
} = require('../controller/authController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route('/login').get(showLoginPage)
router.route('/register').get(showRegisterPage)
router.route('/donar/dashboard').get(isAuthenticatedUser, showDonarDashboard)
router.route('/admin/dashboard').get(isAuthenticatedUser, authorizeRoles('admin'), showAdminDashboard);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser)

router.route('/password/forgot').get(forgotPasswordForm)

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').get(resetPasswordForm).put(resetPassword)

router.route('/me').get(isAuthenticatedUser, getUserProfile)
router.route('/password/update').put(isAuthenticatedUser, updatePassword)
router.route('/me/update').put(isAuthenticatedUser, updateProfile)

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers)
router.route('/admin/user/edit/:id').get(isAuthenticatedUser, authorizeRoles('admin'), editUser)
router.route('/admin/user/:id')
                    .get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
                    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
                    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)

router.route('/logout').get(logoutUser)

module.exports = router