# CampusFlow — Student Management System

## 1. Project Overview

CampusFlow is an interactive Student Management System developed using JavaScript and React. It provides a user-friendly dashboard for managing student records and enrollment information.

## 2. Project Objectives

The main objectives are to:
- Display student records in a dashboard.
- Add new student records.
- Edit existing student information.
- Delete student records after confirmation.
- Search and filter student records.
- Validate user input and display helpful error messages.
- Save student records in the browser using localStorage.

## 3. Technologies Used

- React
- JavaScript (ES6+)
- HTML5
- CSS3
- Vite
- Browser localStorage

## 4. Student Record Fields

Each student record contains:
- Student ID
- Full name
- Age
- Email address
- Course of study
- Enrollment status (Active or Inactive)

## 5. System Features

### Dashboard
Displays student records and statistics showing total, active, and inactive students.

### Add Student
Allows users to enter student information and add a new record.

### Edit Student
Allows users to update an existing student's information.

### Delete Student
Uses a confirmation dialog before deleting a student record.

### Search and Filter
Supports searching by student name, ID, email, or course, and filtering by enrollment status.

### Form Validation
Checks required fields, age limits, email format, and duplicate student IDs or email addresses.

### Data Persistence
Uses browser localStorage to preserve student records between page refreshes in the same browser.

## 6. JavaScript and React Concepts

This project demonstrates:
- Primitive data types, including strings, numbers, and booleans.
- Non-primitive data types, including arrays and objects.
- Variable declarations using const and let where appropriate.
- User-defined functions and arrow functions.
- React functional components.
- State management using useState.
- Side effects using useEffect.
- Event handling for forms, buttons, search, and filters.
- Conditional rendering for modals and empty states.
- Array methods including map, filter, reduce, and some.
- JSON.stringify() and JSON.parse() for browser storage.

## 7. Installation and Setup

### Prerequisites
Install Node.js and npm.

### Installation
1. Clone or download this project.
2. Open the project folder in Visual Studio Code.
3. Open a terminal in the project folder.
4. Install the project dependencies:

   
   npm install
   

5. Start the development server:

   
   npm run dev
   

6. Open the local URL shown in the terminal, usually http://localhost:5173/.

## 8. Testing

Manual tests were performed for the following:
- Required-field validation.
- Rejection of an age below the allowed minimum.
- Invalid email rejection.
- Editing and saving student information.
- Cancelling the Add Student dialog.
- Cancelling the delete confirmation.
- Rejection of duplicate student IDs or email addresses.

All these tests passed during manual testing.

## 9. Data Storage and Limitations

Student records are stored in the browser's localStorage. This is a client-side educational project and does not currently use a remote database or user authentication. Records are stored separately in each browser and device.

## 10. Author Information

- **Student name:** [Mamakakamela Tabitha Makhaba]
- **Course/module:** [Web Development]
- **Institution:** [Limkokwing University]

## 11. Possible Future Improvements

- Database integration.
- User authentication.
- Exporting student records.
- Additional reporting features.

