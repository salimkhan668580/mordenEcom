const z= require('zod');


exports.userRegistration=z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum(['user', 'admin']),
    address:z.array(
        z.object({
            street: z.string(),
            city: z.string(),
            state: z.string(),
            pin: z.number()
    }))
})

exports.AdminLogin=z.object({
  
    email: z.string().email(),
    password: z.string(),
    
})

exports.sendOpt=z.object({
    email: z.string().email("Please provide a valid email address")
})
exports.verifyOpt=z.object({
     email: z.string().email("Please provide a valid email address"),
    otp: z.number()
})

exports.changeAdminPassword=z.object({
     email: z.string().email("Please provide a valid email address"),
     oldpwd:z.string(),
     newpwd:z.string(),
     confirmpwd:z.string()
}).refine((data) => data.newpwd === data.confirmpwd, {
  message: "Passwords do not match",
  path: ["confirmpwd"],
});