import userSchema from '../models/user.model.js';
export const addPost = async(req,res)=> {
  try{const {filmtitle, filmrate, myopinion,category} = req.body;
  const filmimage = req.file ? req.file.path : ""; // cloudinary URL
  const id = req.params.id;
  if(!filmtitle) {
    return res.status(404).json("filmTitle Field Is Requierd");
  }
  if(!filmrate) {
    return res.status(404).json("FilmRate Field Is Requierd");
  }
  if(!myopinion) {
    return res.status(404).json("myOpinion Field Is Requierd");
  }
  if(!filmimage) {
    return res.status(404).json("FilImage Field Is Requierd");
  }

  if(!category){
    return res.status(404).json("Category Field Is Requierd");
  }

  let foundUser = await userSchema.findById( id );

  if(!foundUser){
    return res.status(404).send("No User Found With This Id")
  }
   function getRandomSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
  }
  const newPost= {
    id: getRandomSixDigitNumber(),
    filmtitle:filmtitle,
    filmrate:filmrate,
    myopinion:myopinion,
    category:category,
    filmimage: filmimage,
    comments: [],
    likes: [],
  }

  foundUser.posts.push(newPost)

  await foundUser.save();

  res.status(201).json({message: "Post Has Been Created" , newPost: newPost});

}catch(err) {
    return res.status(500).send(`Error While Adding A Post ${err}`)
  }
}

export const likePost = async (req, res) => {
  try {
    const postid = Number(req.params.postid);
    const userid = req.params.userid;

    // دور على المستخدم اللي عنده البوست ده مباشرة
    const user = await userSchema.findOne({ "posts.id": postid });

    if (!user) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    // لاقي البوست
    const post = user.posts.find((p) => p.id === postid);

    // تحقق إن البوست موجود
    if (!post) {
      return res.status(404).json({ message: "Post Not Found In User" });
    }

    // ازود اللايك
    const likinguser = userSchema.findById(userid);
    post.likes.push(likinguser._id);

    await user.save();

    return res.status(200).json({
      message: "Post Has Been Updated",
      post: post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error While Adding Like to Post",
      error,
    });
  }
};



export const commentPost = async(req,res)=> {
try {
    console.log("BODY:", req.body);
    const postid = Number(req.params.postid);
    const userid = req.params.userid;
    const allUsers = await userSchema.find();
    const { comment } = req.body
    let userOfPost = null;

    let updatedPost = null;

    const user = await userSchema.findById(userid);

    const newcomment = {
      user: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar
      },
      comment: comment,
    }

    for (let user of allUsers) {
      for (let post of user.posts) {
        if (post.id === postid) {
          post.comments.push(newcomment);
          userOfPost = user;
          updatedPost = post;
          break;
        }
      }
      if (userOfPost) break; // خرج من لوب اليوزرات بعد ما لقى البوست
    }

    if (!userOfPost) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    await userOfPost.save();

    return res.status(200).json({ message: "Post Has Been Updated", post: updatedPost });
} catch (error) {
  console.error("❌ Error while commenting:", error); // دي هتطبع في الكونسول
  return res.status(500).json({
    message: "Error While Adding A Comment to Post",
    error: error.message || error.toString()
  });
}
}
