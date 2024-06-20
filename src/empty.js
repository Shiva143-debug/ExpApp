
// app.post("/login", (req, res) => {
//     const { loginEmail, password } = req.body;
//     console.log("Received login request:", req.body);

//     const sql = "SELECT * FROM register WHERE email = $1 AND password = $2";

//     const values = [loginEmail, password];

//     pool.query(sql, values, (err, result) => {
//         console.log(result.rows)
//         if (err) {
//             console.error("Error executing query:", err);
//             return res.status(500).json({ error: "Internal server error" });
//         }



//         if (result.rows.length === 0) {
//             // No matching user found
//             return res.status(401).json({ error: "Invalid email or password" });
//         }

//         const user = result.rows[0];
//         if (user.password !== password) {
//             // Password doesn't match
//             return res.status(401).json({ error: "Invalid email or password" });
//         }

//         // Login successful
//         return res.status(200).json({ message: "Login successful", result:user });
//     });
// });

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'shivarama99666@gmail.com',
//       pass: 'oqvv hcwv ygza waws'
//     }
//   });
  
  
//   app.post("/registerr", (req, res) => {
//     const { FullName, email, mobileNo, address } = req.body;
//     console.log("Received data:", req.body);
  
//     const password = Math.floor(1000 + Math.random() * 999999).toString();
  
//     const checkDuplicateEmailQuery = "SELECT COUNT(*) AS count FROM RegisterTable1 WHERE email = ?";
//     const insertQuery = "INSERT INTO RegisterTable1 (`FullName`, `email`, `mobileNo`, `address`, `password`) VALUES (?, ?, ?, ?, ?)";
  
//     // Check if the email already exists in the database
//     db.query(checkDuplicateEmailQuery, [email], (err, result) => {
//       if (err) {
//         console.error("Error checking for duplicate email:", err);
//         return res.status(500).json({ error: "An error occurred while checking for duplicate email" });
//       }
  
//       if (result[0].count > 0) {
//         // If the email already exists, return an error
//         return res.status(400).json({ error: "Email already exists. Please use a different email address." });
//       } else {
//         // If the email is unique, insert the new record
//         const values = [FullName, email, mobileNo, address, password];
//         pool.query(insertQuery, values, (insertErr, insertResult) => {
//           if (insertErr) {
//             console.error("Error inserting record:", insertErr);
//             return res.status(500).json({ error: "An error occurred while inserting record" });
//           }
  
//           // Send email with the generated password
//           const mailOptions = {
//             from: 'shivarama99666@gmail.com',
//             to: email,
//             subject: 'Your Password for Registration',
//             text: `Dear ${FullName}, Your password for registration is ${password}.`
//           };
  
//           transporter.sendMail(mailOptions, (mailErr, info) => {
//             if (mailErr) {
//               console.error("Error sending email:", mailErr);
//               return res.status(500).json({ error: "An error occurred while sending email" });
//             }
  
//             return res.json({ success: true, message: "Registration successful. Password sent to your email." });
//           });
//         });
//       }
//     });
//   });
// app.post("/register", (req, res) => {
//     const { full_name, email, mobile_no, address } = req.body;
//     console.log("Received data:", req.body);

//     const password = Math.floor(1000 + Math.random() * 999999).toString();

//     const checkDuplicateEmailQuery = "SELECT COUNT(*) AS count FROM register WHERE email = $1";
//     const insertQuery = "INSERT INTO register (full_name, email, mobile_no, address, password) VALUES ($1, $2, $3, $4, $5)";

//     // Check if the email already exists in the database
//     pool.query(checkDuplicateEmailQuery, [email], (err, result) => {
//         if (err) {
//             console.error("Error checking for duplicate email:", err);
//             return res.status(500).json({ error: "An error occurred while checking for duplicate email" });
//         }

//         if (result.rows[0].count > 0) {
//             // If the email already exists, return an error
//             return res.status(400).json({ error: "Email already exists. Please use a different email address." });
//         } else {
//             // If the email is unique, insert the new record
//             const values = [full_name, email, mobile_no, address, password];
//             pool.query(insertQuery, values, (insertErr, insertResult) => {
//                 if (insertErr) {
//                     console.error("Error inserting record:", insertErr);
//                     return res.status(500).json({ error: "An error occurred while inserting record" });
//                 }
//                 return res.json({ success: true, message: "Registration successful" });
//             });
//         }
//     });
// });

// app.post("/register", (req, res) => {
//     const { full_name, email, mobile_no, address } = req.body;
//     console.log("Received data:", req.body);

//     const password = Math.floor(1000 + Math.random() * 999999).toString();

//     const checkDuplicateEmailQuery = "SELECT COUNT(*) AS count FROM register WHERE email = $1";
//     const insertQuery = "INSERT INTO register (`full_name`, `email`, `mobile_no`, `address`, `password`) VALUES ($1, $2, $3, $4, $5)";

//     // Check if the email already exists in the database
//     pool.query(checkDuplicateEmailQuery, [email], (err, result) => {
//         if (err) {
//             console.error("Error checking for duplicate email:", err);
//             return res.status(500).json({ error: "An error occurred while checking for duplicate email" });
//         }

//         if (result[0].count > 0) {
//             // If the email already exists, return an error
//             return res.status(400).json({ error: "Email already exists. Please use a different email address." });
//         } else {
//             // If the email is unique, insert the new record
//             const values = [full_name, email, mobile_no, address, password];
//             pool.query(insertQuery, values, (insertErr, insertResult) => {
//                 if (insertErr) {
//                     console.error("Error inserting record:", insertErr);
//                     return res.status(500).json({ error: "An error occurred while inserting record" });
//                 }
//                 return res.json({ success: true, message: "Registration successful" });
//             });
//         }
//     });
// });
