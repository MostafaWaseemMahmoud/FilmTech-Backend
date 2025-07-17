import userSchema from '../models/user.model.js';
export const addUser = async(req,res)=> {
    try {
    const { name, email, password } = req.body;
    // Check if email already exists
    const exists = await userSchema.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const avatarUrl = req.file ? req.file.path : ""; // cloudinary URL

          if(!name) {
        return res.status(404).json("Name Field Is Requierd");
      }
      if(!email) {
        return res.status(404).json("email Field Is Requierd");
      }
      if(!password) {
        return res.status(404).json("password Field Is Requierd");
      }
      if(!avatarUrl) {
        return res.status(404).json("avatarUrl Field Is Requierd");
      }

    // Create new user
    const user = new userSchema({ name, email, password,avatar:avatarUrl,friends: [], posts: [] });
    await user.save();

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getAllUsers = async (req,res)=> {
  try {
      const allUsers = await userSchema.find();

  return res.status(200).json(allUsers)
  } catch (error) {
    return res.status(500).json(`Error While Getting All Users => ${error}`)
  }

}

export const getIdUser = async (req,res)=> {
  try {
    const id  = req.params.id;
  const user = await userSchema.find({ id });

  if(!id) {
    return res.status(404).json("Id Param Is Required")
  }
  if(!user){
    return res.status(404).json("No User With It Id")
  }
  return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(`Error While Getting User By It Id => ${error}`)
  }

}

export const FindUserAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Received body:", req.body);

    if (!email) {
      console.log("No email in body");
      return res.status(400).json("Email field is required");
    }

    if (!password) {
      console.log("No password in body");
      return res.status(400).json("Password field is required");
    }

    console.log("Searching for email (lowercased):", email.toLowerCase());

    const emailUser = await userSchema.findOne({ email: email.toLowerCase() });
    console.log("Result from DB:", emailUser);

    if (!emailUser) {
      return res.status(404).json("No user With It Email");
    }

    const isMatch = emailUser.password === password;
    console.log("Password Match:", isMatch);

    if (isMatch) {
      return res.status(200).json(emailUser);
    } else {
      return res.status(401).json("Wrong Password");
    }
  } catch (error) {
    console.error("Error during user search:", error);
    return res.status(500).json(`Error While Finding A User => ${error.message}`);
  }
};

export const FriendReq = async (req,res)=> {
  try {
    const {userId, friendId} = req.params;
    const user = await userSchema.findById(userId);
    const friend = await userSchema.findById(friendId);

    if(!user || !friend){
      return res.status(404).json({message: "Wrong Id"});
    }

    for(let i=0; i < user.friendRequests.length; i++) {
      if(user.friendRequests[i] === friendId){
        return res.status(401).json({message: "You have Already Send Him A Friend Req"});
      }
    }
    for(let i=0; i < user.friends.length; i++) {
      if(user.friends[i] === friendId){
        return res.status(401).json({message: "You Are Already Friends"});
      }
    }

    user.friendRequests.push(friendId);
    friend.waitingFriends.push(userId);



    await user.save();
    await friend.save();

    return res.status(200).json({user: user, friend: friend});
  } catch (error) {
    return res.status(500).json({message: `Error While Sending A Friend Request ${error}`});
  }
}

export const acceptReq = async (req,res)=> {
  try {
        const {userId, friendId} = req.params;
    const user = await userSchema.findById(userId);
    const friend = await userSchema.findById(friendId);

    if(!user || !friend){
      return res.status(404).json({message: "Wrong Id"});
    }


        for(let i=0; i < user.friends.length; i++) {
      if(user.friends[i] === friendId){
        return res.status(401).json({message: "You Are Already Friends"});
      }
    }

      const index1 = user.friendRequests.indexOf(friendId);
      if (index1 !== -1) {
        user.friendRequests.splice(index1, 1);
      }

      const index2 = friend.waitingFriends.indexOf(userId);
      if (index2 !== -1) {
        friend.waitingFriends.splice(userId, 1);
      }

      user.friends.push(friendId)
      friend.friends.push(userId);

      await user.save();
      await friend.save();

      res.status(200).json({message: "Request Accepted" , user:user,friend:friend});
  } catch (error) {
    return res.status(500).json({message: `Error While Accepting A Friend Request ${error} `});
  }
}

export const RejectReq = async (req,res)=> {
  try {
        const {userId, friendId} = req.params;
    const user = await userSchema.findById(userId);
    const friend = await userSchema.findById(friendId);

    if(!user || !friend){
      return res.status(404).json({message: "Wrong Id"});
    }


        for(let i=0; i < user.friends.length; i++) {
      if(user.friends[i] === friendId){
        return res.status(401).json({message: "You Are Already Friends"});
      }
    }

      const index1 = user.friendRequests.indexOf(friendId);
      if (index1 !== -1) {
        user.friendRequests.splice(index1, 1);
      }

      const index2 = friend.waitingFriends.indexOf(userId);
      if (index2 !== -1) {
        friend.waitingFriends.splice(userId, 1);
      }
      await user.save();
      await friend.save();

      res.status(200).json({message: "Request Rejected" , user:user,friend:friend});
  } catch (error) {
    return res.status(500).json({message: `Error While Accepting A Friend Request ${error} `});
  }
}

