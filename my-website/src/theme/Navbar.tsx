// import React from 'react';
// import Navbar from '@theme-original/Navbar';
// import Link from '@docusaurus/Link';
// import { translate } from '@docusaurus/Translate';

// const CustomNavbar = (props) => {
//   // Check authentication status directly from localStorage
//   const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('token');

//   // Clone the original navbar items if they exist
//   const originalItems = props.navbar?.items || [];
//   const navbarItems = [...originalItems];

//   // Filter out Sign In and Sign Up items if user is authenticated
//   let filteredItems = isAuthenticated
//     ? navbarItems.filter(item =>
//         !(item.label === 'Sign In' || item.label === 'Sign Up')
//       )
//     : navbarItems;

//   // Add Sign In and Sign Up buttons if user is not authenticated
//   if (!isAuthenticated) {
//     filteredItems = [
//       ...filteredItems,
//       {
//         type: 'dropdown',
//         position: 'right',
//         label: 'Account',
//         items: [
//           {
//             type: 'dropdown',
//             label: 'Sign In',
//             to: '/signin',
//           },
//           {
//             type: 'dropdown',
//             label: 'Sign Up',
//             to: '/signup',
//           }
//         ]
//       }
//     ];
//   }

//   // Add a Profile/Dashboard/Sign Out item if user is authenticated
//   if (isAuthenticated) {
//     filteredItems.push({
//       type: 'dropdown',
//       position: 'right',
//       label: 'Account',
//       items: [
//         {
//           type: 'dropdown',
//           label: 'Dashboard',
//           to: '/dashboard',
//         },
//         {
//           type: 'dropdown',
//           label: 'Profile',
//           to: '/profile',
//         },
//         {
//           type: 'dropdown',
//           label: 'Sign Out',
//           to: '#',
//           onClick: (e) => {
//             e.preventDefault();
//             // Remove tokens from localStorage
//             localStorage.removeItem('token');
//             localStorage.removeItem('user');

//             // Refresh the page to update the navbar
//             window.location.reload();
//           }
//         }
//       ]
//     });
//   }

//   return <Navbar {...props} navbar={{ ...props.navbar, items: filteredItems }} />;
// };

// export default CustomNavbar;