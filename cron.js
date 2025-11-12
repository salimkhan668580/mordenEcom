// const  { CronJob } =require('cron')
// const userModel=require('./models/userModel')
// const job = new CronJob(
//     '* * * * *',
// 	 async function () {
// 	const threeMonthsAgo = new Date();
// threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
// const result = await userModel.updateMany(
//   {
//     isActive: false,
//     isDeleted: false,
//     deactivatedAt: { $lte: threeMonthsAgo },
//   },
//   {
//     $set: { isDeleted: true },
//   }
// );

// console.log(`✅ Inactive users marked as deleted: ${result.modifiedCount}`);
// 	}, 
// 	null, 
// 	true,
// 	'Asia/Kolkata'
// );

// module.exports=job