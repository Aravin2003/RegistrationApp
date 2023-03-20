#########
RegistrationApp

This repo is create regarding the backend assignment provided by the GDSC club of SASTRA.
This app runs on node.js and uses mongo Atlas for database.

#The following dependencies were installed using npm.
"dependencies": {
    "bcrypt": "^5.1.0",
    "connect-flash": "^0.1.1",
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.0.3",
    "ejs": "^3.1.9",
    "express-session": "^1.17.3",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.2",
    "path": "^0.12.7"
  }
  
  -> bcrypt is used to encrypt and salt the password.
  -> connect-flash is used to send flash messages using sessions,
  -> connect-sessions for implementing flash.
  -> dotenv to create env file to store jwt secret, mongo password .
  -> ejs- to write dynamic html code
  ->jsonwebtoken for authentication and authorisation.
  -> mongoose to connect mongodb to express
  -> path to set static dir. path to access other folders.
  
 ##Data models and schema:
   -> data model was created for STUDENTS, COURSES and ADMINS.
   
   ADMIN:
       const adminschema= new mongoose.Schema(
    {
        username:
        {
            type: String,
            required: true
        },
        password:
        {
            type: String,
            required: true
        }
    }
);

--- An admin is given an username and a passowrd to access the portal.
 
   STUDENT:
          const studentschema= new mongoose.Schema(
    {
        name:
        {
            type: String,
            required:true
        },
        regNo:
        {
            type: Number,
            required:true,
            min:[100000,"The register number must contain 6-digits only"],
            max: [999999,"The register number must contain 6-digits only"],
            unique:true
        },
        dob:
        {
            type: Date,
            required: true
        },
        password:
        {
            type: String,
            required: true,
        },
        courses:
        [
            {
                type: String,
                required:true,
                unique:true
            }
        ]
    }
);

-> The student's name, regNo, DOB and registered courses are stored.

  COURSES:
        const courseschema= new mongoose.Schema(
    {
        name:
        {
            type: String,
            required: true,
            unique:true
        },
        teacher:
        {
            type: String,
            required: true
        }
    }
);

-> Name of the course and the respective faculty is stored.

  ** REQUEST and RESPONSE, ERROR HANDLING, AUTHENTICATION SECURITY AND CRUD:

1. In the landing page, choose whether you are a student or an admin.
2. Students are taken to login route : get req- "/auth".
3. Unregistered students can also register. : get req- "/register"
4. Register- post req-"/register", the request body is deconstructed to retrieve value and a new object is created for
   the student model.
   router.post("/register",async(req,res){  ===> accessing mongodb is asynchronous and await keyword is used.
   **await**
   });
5. Error: The regNo is unique in this model and *must* be a 6-digit number.
   The number is checked if it is >100000 && <999999.
   Else req.flash("success","The register number must be a 6-digit number!")
   message is thrown.
6. Similarly, the entire post request is in a try block and any error is caught and
   catch(e)
   {
    req.flash("success",e.message)
   }
 7. SECURITY: 
    TO maintain a high level of security BCrypt function has been used to hash the password using an optimal 12 rounds ofsalt.
    The regNo is used to retrieve the hashed password and brcypt comapre them both.
    If it is not a match an error is thrown.
    If it matches a new jwt token is created and signed.
    The payload being: regNo of the student and respective object_id.
    And is stored in a cookie.
 
            SECRET***::
 
            1. The administrator is given a high level of power as he can alter the database.
            2. There is only one login credential for admin:
                     ** Username : "sastraAdmin",
                     ** Password : "sastra123"
            3. But there is a secret API to create a new administartor;
               "/secret".
               This is not provided anywhere in the frontend and is clearly hidden.
             4.Using this route, a new admin can be create with all the same powers.
8. ValidateToken:
   Once logged in, the student has to be remembered to access his dashboard, get req:("/dashboardStudent");
   as the dashboard route is protected and can **only** be accessed by students.
   ValidateToken function is defined for this perpose where the integrity of the jwt token is checked.
   If the token does not exist or is wrong, error is thrown using flash and the user redirected to "/auth".
9. Logout:
   "/logout" works for both student and admin as well.
   when this route is hit, the maxAge of the jwt token is set to 1 ms.
   The user is logged out and redirected to "/".
   
10.Similarly, admin can login using "/adminAuth".
   On successful verification he is redirected to "/dashboardAdmin".
   
11.In the student dashboard all available courses are displayed in a drop down menu and the student and apply directly.
   His course registrations list are updated immediately.
   
12.In the admin dashboard, links are provided to :

   create course: ("/createCourse");
   
   delete course: ("/deleteCourse");
   
   Remove student: ("/removeStudent");
   
   logout: ("/logout");
   
13. In the dashboard all existing courses are displayed.
   All students who have applied are also displayed along with all their details and all the courses they have applied to.


***BELOW***
***All routes explained above are implemented with examples of valid and invalid requests.***
***Error handling is clearly showcased and all CRUD operations required are also demonstrated.***


===>>>> link: https://drive.google.com/drive/folders/1nzkniCWRxvN-LEN5o43OWig_6szhtOGZ



#############
#####
##
