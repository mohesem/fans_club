import User from '../DB/models/userModel'

const main = body => {
    return new Promise(async (resolve, reject) => {
        const session = await mongoose.startSession();
      session.startTransaction();
        try {
            jwt.verify(body.token, process.env.TOKEN, (err, decoded) => {
                console.log(decoded)
            }
                //  const user = await User.findOne({_id === body.User.}) 
      } catch (error) {
          
      }
  });

};