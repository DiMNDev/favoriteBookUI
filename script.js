const rootVars = document.querySelector(":root");
const signInCard = document.querySelector(".signInCard");
const signUpCard = document.querySelector(".signUpCard");
const loginCard = document.querySelector(".login-card");
const signInBtn = document.querySelector(".signInBtn");
const signUpBtn = document.querySelector(".signUpBtn");
const logoutBtn = document.querySelector(".xContainer");

const inputCard = document.querySelector(".input-card");
const newEntryCard = document.querySelector(".newEntryCard");
const addBtn = document.querySelector(".addBtn");
const closeBtn = document.querySelector(".closeContainer");
const entryBtn = document.querySelector(".entryBtn");
let listItem = document.querySelector(".listItem");

let userFavorites = [];
let savedFavorites = [];
let allFavorites = [];

const degrees = {
  // Left
  leftPage: {
    closed: 88,
    open: 42,
  },
  page1: {
    closed: 86,
    open: 40,
  },
  page2: {
    closed: 83,
    open: 38,
  },
  page3: {
    closed: 80,
    open: 36,
  },
  page4: {
    closed: 78,
    open: 34,
  },
  leftCover: {
    closed: 76,
    open: 32,
  },
  //   Right
  rightPage: {
    closed: -88,
    open: -42,
  },
  page5: {
    closed: -86,
    open: -40,
  },
  page6: {
    closed: -84,
    open: -38,
  },
  page7: {
    closed: -80,
    open: -36,
  },
  page8: {
    closed: -78,
    open: -34,
  },
  rightCover: {
    closed: -76,
    open: -32,
  },
  coverShader: {
    closed: 42,
    open: 0,
  },
};

//#region Server side functions
//Sign In
const signInFunction = async () => {
  //Define Elements
  const emailField = document.getElementById("signInEmail");
  const passwordField = document.getElementById("signInPassword");
  const errorField = document.querySelector(".signInError");

  //Make Request
  const authorized = await fetch("http://localhost:3000/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: emailField.value,
      password: passwordField.value,
    }),
  });

  //Handle Server/DB Errors
  const response = await authorized.json();
  console.log(response);
  if (response.msg) {
    errorField.innerHTML = response.msg;
    clearError(errorField);
    console.log(response.msg);
  }

  //Check for token
  if (response.token) {
    sessionStorage.setItem("JWT", response.token);
  }

  //Front-end verification
  if (sessionStorage.getItem("JWT")) {
    console.log("Log in successful");
    console.log(`Welcome, ${response.user.name}`);
    const username = response.user.name;
    // loadUserPoemsFromDatabase();
    emailField.value = "";
    passwordField.value = "";
    loadDashboard(username);
  }
};
//Sign Up
const signUpFunction = async () => {
  //Define Elements
  const aliasField = document.getElementById("alias");
  const emailField = document.getElementById("signUpEmail");
  const passwordField = document.getElementById("signUpPassword");
  const confirmField = document.getElementById("confirmPassword");
  const subscribeBox = document.getElementById("subscribe");

  //Handle Form Errors
  if (!aliasField.value) {
    throw new Error("Please provide your alias");
  }

  if (!emailField.value) {
    throw new Error("Please provide an email");
  }

  if (!passwordField.value) {
    throw new Error("Password required");
  }

  if (passwordField.value !== confirmField.value) {
    throw new Error("Passwords do not match");
  }

  //Make Request
  const authorized = await fetch("http://localhost:3000/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: aliasField.value,
      email: emailField.value,
      password: passwordField.value,
    }),
  });

  //Handle Server/DB Errors
  const response = await authorized.json();
  if (response.msg) {
    console.log(response.msg);
  }
  //Check for token
  if (response.token) {
    sessionStorage.setItem("JWT", response.token);
  }

  //Front-end verification
  if (sessionStorage.getItem("JWT")) {
    console.log("Register and Log in successful");
    loadDashboard();
  }
};
//Add Entry
const addNewEntry = async () => {
  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const genre = document.getElementById("genre");
  const ISBN = document.getElementById("ISBN");
  await fetch("http://localhost:3000/user/books/addBook", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title.value,
      author: author.value,
      genre: genre.value,
      ISBN: ISBN.value,
    }),
  });
  //   resetInputs();
  title.value = "";
  author.value = "";
  genre.value = "";
  ISBN.value = "";
  loadAllFavorites();
  loadUserFavorites();
  //   theDOM.updatePoemList();
};
//Clear DOM error message
const clearError = (errorField) => {
  setTimeout(() => {
    errorField.innerHTML = "";
  }, 3000);
};
//Populate lists from response
const getAllFavorties = async () => {
  const all = await fetch("http://localhost:3000/user/books/all", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
      Accept: "application/json",
    },
  });
  const loadedArray = await all.json();
  // console.log(loadedArray);
  return loadedArray.allBooks;
};
const getSavedFavorties = async () => {
  const books = await fetch("http://localhost:3000/user/books/allSavedArray", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
      Accept: "application/json",
    },
  });
  const loadedArray = await books.json();
  // console.log(loadedArray);
  return loadedArray.books;
};
const getUserFavorties = async () => {
  const books = await fetch("http://localhost:3000/user/books/allUserArray", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
      Accept: "application/json",
    },
  });
  const loadedArray = await books.json();
  // console.log(loadedArray);
  return loadedArray.books;
};
//Toggle Favorites - Heart
const callToggleHeart = async (isbnAsId) => {
  try {
    const status = await fetch("http://localhost:3000/user/books/toggleHeart", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ ISBN: isbnAsId }),
    });
    console.log(status);
    response = await status.json();
    console.log(JSON.stringify({ ISBN: isbnAsId }));
    console.log("Fetched:", response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
//Add New Comment
const addNewComment = async (ISBN, comment) => {
  await fetch("http://localhost:3000/user/books/addComment", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ ISBN: ISBN, comment: comment }),
  });
};
//Delete Comment
const deleteComment = async (commentBtn) => {
  //Find by ISBN
  const isbn = document.querySelector(".isbnDetail");
  const commentID = commentBtn.parentNode.id;
  //Call API
  console.log(`This is the isbn that has the comment ${isbn.innerHTML}`);
  console.log(`This is the comment to delete ${commentID}`);
  try {
    const status = await fetch(
      "http://localhost:3000/user/books/deleteComment",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ISBN: isbn.innerHTML, commentID: commentID }),
      }
    );
    const response = await status.json();
    console.log(response);
    //On delete, loadOne from the database AFTER fetch, THEN search the local array
    //for the object index and replace the data. THEN search the array of comments and replace the same index in that array

    //While detail view is visible add a "streaming" listener for new database entries to populate comments
    //X/edit only shows on current user comments
    loadUserFavorites();
    loadAllFavorites();
    const singleBook = await loadOne(isbn.innerHTML);
    console.log(singleBook);
    buildDetail(singleBook);
  } catch (error) {
    throw new Error("Error while deleting");
  }
};
//Get One Book
const loadOne = async (ISBN) => {
  try {
    const oneBook = await fetch("http://localhost:3000/user/books/one", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ ISBN: ISBN }),
    });
    response = await oneBook.json();
    return response;
  } catch (error) {
    throw new Error("can not load that book");
  }
};
const getLocalIndex = async (ISBN) => {
  //Check (specific)local array of book objs for index of target
  //await performFunction()
  //Update target at index in specific/local array of book objs
  //Update coresponding comment in the list of comments *same as array index? I believe so, until multideletion sync database errors as far as order depending on how and when data reloads from the db are

  for (book of books) {
  }
};
//#endregion

//#region DOM Control
//Open Book Dashboard
const loadDashboard = (username) => {
  const welcomeUser = document.querySelector(".username");
  welcomeUser.innerHTML = username;
  userFavorites = [];
  savedFavorites = [];
  allFavorites = [];
  rootVars.style.setProperty("--signInCardHeight", "0rem");
  rootVars.style.setProperty("--signUpCardHeight", "0rem");
  signInCard.classList.add("hidden");
  signUpCard.classList.add("hidden");
  loginCard.style.setProperty("--loginCardWidth", "0rem");
  loginCard.style.setProperty("--loginCardHeight", "0rem");
  loginCard.classList.add("scaleOut");
  signInBtn.classList.add("scaleDown");
  signUpBtn.classList.add("scaleDown");
  rootVars.style.setProperty("--page1", `${degrees.page1.open}deg`);
  rootVars.style.setProperty("--page2", `${degrees.page2.open}deg`);
  rootVars.style.setProperty("--page3", `${degrees.page3.open}deg`);
  rootVars.style.setProperty("--page4", `${degrees.page4.open}deg`);
  rootVars.style.setProperty("--page5", `${degrees.page5.open}deg`);
  rootVars.style.setProperty("--page6", `${degrees.page6.open}deg`);
  rootVars.style.setProperty("--page7", `${degrees.page7.open}deg`);
  rootVars.style.setProperty("--page8", `${degrees.page8.open}deg`);
  rootVars.style.setProperty("--rightCover", `${degrees.rightCover.open}deg`);
  rootVars.style.setProperty("--leftCover", `${degrees.leftCover.open}deg`);
  rootVars.style.setProperty("--coverShader", `${degrees.coverShader.open}deg`);
  rootVars.style.setProperty("--leftPage", `${degrees.leftPage.open}deg`);
  rootVars.style.setProperty("--rightPage", `${degrees.rightPage.open}deg`);
  loadUserFavorites();
  loadAllFavorites();
};
//Load Users Favorites
const loadUserFavorites = async () => {
  const listBody = document.querySelector(".userFavorites");
  listBody.innerHTML = "";
  //auth?
  //Populate saved favorites from array
  const userFavArray = await getUserFavorties();
  // console.log(userFavArray);
  userFavorites = userFavArray;
  userFavorites.forEach((book, index) => {
    listBody.innerHTML += `  
    <li class="listItem" id="U:${index}" onClick="displayDetail(this)"> 
    <div class="itemTitle">${book.title}</div>
    <div class="itemAuthor">${book.author}</div>
    </li>`;
  });
  //Populate saved favorites from array
  const savedFavArray = await getSavedFavorties();
  // console.log(savedFavArray);
  savedFavorites = savedFavArray;
  savedFavorites.forEach((book, index) => {
    listBody.innerHTML += `  
    <li class="listItem" id="S:${index}" onClick="displayDetail(this)"> 
    <div class="itemTitle">${book.title}</div>
    <div class="itemAuthor">${book.author}</div>
    </li>`;
  });
  console.log("User", userFavorites);
};
//Load All Favorites
const loadAllFavorites = async () => {
  const listBody = document.querySelector(".allFavorites");
  listBody.innerHTML = "";
  //load user from database with token
  const allFavArray = await getAllFavorties();
  allFavorites = allFavArray;
  //   console.log(allFavArray);
  allFavorites.forEach((book, index) => {
    listBody.innerHTML += `  
      <li class="listItem" id="A:${index}" onClick="displayDetail(this)">
      <div class="itemTitle">${book.title}</div>
      <div class="itemAuthor">${book.author}</div>
      </li>`;
  });

  console.log("All", allFavorites);
};
//Open Entry Input Card
addBtn.addEventListener("click", () => {
  inputCard.classList.add("scaleIn");
  inputCard.style.setProperty("--inputCardOpacity", "1");
  inputCard.style.setProperty("--inputCardOpacity", "1");
  inputCard.style.setProperty("--inputCardVisibility", "visible");
});
//Close Entry Input Card
closeBtn.addEventListener("click", () => {
  inputCard.classList.remove("scaleIn");
  inputCard.style.setProperty("--inputCardOpacity", "0");
  inputCard.style.setProperty("--inputCardOpacity", "0");
  inputCard.style.setProperty("--inputCardVisibility", "hidden");
});
//Submit New Entry
entryBtn.addEventListener("click", () => {
  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const genre = document.getElementById("genre");
  const isbn = document.getElementById("ISBN");
  if (!title.value || !author.value || !genre.value || !isbn) {
    console.log("Provide all fields");
  } else if (
    title.value !== "" &&
    author.value !== "" &&
    genre.value !== "" &&
    isbn.value !== ""
  ) {
    addNewEntry();
  }
});
//Login -> dashboard
signInBtn.addEventListener("click", () => {
  const email = document.getElementById("signInEmail");
  const password = document.getElementById("signInPassword");
  const errorField = document.querySelector(".signInError");

  if (!signInCard.classList.contains("hidden")) {
    if (!email.value) {
      let error = "Email is required";
      errorField.innerHTML = error;
      clearError(errorField);
      throw new Error(error);
    }
    if (!password.value) {
      let error = "Password is required";
      errorField.innerHTML = error;
      clearError(errorField);
      throw new Error(error);
    }
    if (email.value && password.value) {
      // SIGN IN API CALL HERE
      signInFunction();
    }
  } else if (signInCard.classList.contains("hidden")) {
    rootVars.style.setProperty("--signInCardHeight", "20rem");
    rootVars.style.setProperty("--signUpCardHeight", "0rem");
    signInCard.classList.remove("hidden");
    signUpCard.classList.add("hidden");
  } else if (email.value == "" && password.value == "") {
    rootVars.style.setProperty("--signInCardHeight", "0rem");
    signInCard.classList.add("hidden");
  }
});
//Signup -> dashboard
signUpBtn.addEventListener("click", () => {
  const email = document.getElementById("signUpEmail");
  const alias = document.getElementById("alias");
  const password = document.getElementById("signUpPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const errorField = document.querySelector(".signUpError");
  let error = "Ya done did messed up";
  // SIGN UP API CALL GOES HERE

  if (!signUpCard.classList.contains("hidden")) {
    if (!email.value) {
      error = "Email is required";
      errorField.innerHTML = error;
      clearError(errorField);
      throw new Error("Email is required");
    }
    if (!alias.value) {
      error = "Alias is required";
      errorField.innerHTML = error;
      clearError(errorField);
      throw new Error("Alias is required");
    }
    if (!password.value) {
      error = "Password is required";
      errorField.innerHTML = error;
      clearError(errorField);
      throw new Error("Password is required");
    }
    if (password.value !== confirmPassword.value) {
      error = "Passwords do not match";
      errorField.innerHTML = error;
      clearError(errorField);
      throw new Error(error);
    }
    if (email.value && alias.value && password.value && confirmPassword.value) {
      signUpFunction();
    }
  } else if (signUpCard.classList.contains("hidden")) {
    rootVars.style.setProperty("--signUpCardHeight", "25rem");
    rootVars.style.setProperty("--signInCardHeight", "0rem");
    signUpCard.classList.remove("hidden");
    signInCard.classList.add("hidden");
  } else {
    rootVars.style.setProperty("--signUpCardHeight", "0rem");
    signUpCard.classList.add("hidden");
  }
});
//Logout -> signIn
logoutBtn.addEventListener("click", () => {
  userFavorites = [];
  savedFavorites = [];
  allFavorites = [];
  signInCard.style.setProperty("--signInCardOpacity", "1");
  loginCard.style.setProperty("--loginCardOpacity", "1");
  loginCard.style.setProperty("--loginCardWidth", "40rem");
  loginCard.style.setProperty("--loginCardHeight", "52rem");
  loginCard.style.setProperty("--loginCardVisibility", "visible");
  loginCard.classList.remove("scaleOut");
  signInBtn.classList.remove("scaleDown");
  signUpBtn.classList.remove("scaleDown");
  inputCard.classList.remove("scaleIn");
  rootVars.style.setProperty("--page1", `${degrees.page1.closed}deg`);
  rootVars.style.setProperty("--page2", `${degrees.page2.closed}deg`);
  rootVars.style.setProperty("--page3", `${degrees.page3.closed}deg`);
  rootVars.style.setProperty("--page4", `${degrees.page4.closed}deg`);
  rootVars.style.setProperty("--page5", `${degrees.page5.closed}deg`);
  rootVars.style.setProperty("--page6", `${degrees.page6.closed}deg`);
  rootVars.style.setProperty("--page7", `${degrees.page7.closed}deg`);
  rootVars.style.setProperty("--page8", `${degrees.page8.closed}deg`);
  rootVars.style.setProperty("--rightCover", `${degrees.rightCover.closed}deg`);
  rootVars.style.setProperty("--leftCover", `${degrees.leftCover.closed}deg`);
  rootVars.style.setProperty(
    "--coverShader",
    `${degrees.coverShader.closed}deg`
  );
  rootVars.style.setProperty("--leftPage", `${degrees.leftPage.closed}deg`);
  rootVars.style.setProperty("--rightPage", `${degrees.rightPage.closed}deg`);
  sessionStorage.setItem("JWT", "");
});

const displayDetail = (book) => {
  const arrayToSearch = book.id.charAt(0);
  console.log(arrayToSearch);
  const index = book.id.substring(2, book.id.length);
  console.log(index);
  switch (arrayToSearch) {
    case "U":
      console.log(userFavorites[index]);
      buildDetail(userFavorites[index]);
      break;

    case "A":
      console.log(allFavorites[index]);
      buildDetail(allFavorites[index]);
      break;
    case "S":
      console.log(savedFavorites[index]);
      buildDetail(savedFavorites[index]);
      break;
  }
  console.log(book);
};
//Build Detail
const buildDetail = (book) => {
  console.log(book);
  const detailView = document.querySelector(".userFavoriteDetailContainer");
  if (detailView.classList.contains("hidden")) {
    detailView.classList.remove("hidden");
    rootVars.style.setProperty("--detailCardHeight", "45rem");
  }
  //
  if (checkFavorited(book)) {
    console.log("favorited");
    fillHeart();
  } else {
    console.log("unfavorited");
    drainHeart();
  }
  //
  console.log(book);
  const title = document.querySelector(".titleDetail");
  const author = document.querySelector(".authorDetail");
  const genre = document.querySelector(".genreDetail");
  const isbn = document.querySelector(".isbnDetail");
  title.innerHTML = book.title;
  author.innerHTML = book.author;
  genre.innerHTML = book.genre;
  isbn.innerHTML = book.ISBN;

  //Populate comment section
  const commentSection = document.querySelector(".commentSection");
  commentSection.innerHTML = "";
  for (comment of book.comments) {
    console.log(comment);
    commentSection.innerHTML += ` <div class="comment" id="${comment._id}">
    <div class="deleteCommentBtn" onClick="deleteComment(this)">X</div>
    <div class="commentUser">${comment.username}</div>
    <div class="commentContext">${comment.comment}</div>
  </div>`;
  }
};

const checkFavorited = (book) => {
  for (index of savedFavorites) {
    console.log("index", index);
    console.log("book", book);
    if (index._id === book._id) {
      console.log("favorite");
      return true;
    }
  }
  return false;
};

const closeDetailBtn = document.querySelector(".xUserDetailContainer");
closeDetailBtn.addEventListener("click", () => {
  const detailView = document.querySelector(".userFavoriteDetailContainer");
  rootVars.style.setProperty("--detailCardHeight", "0rem");
  if (!detailView.classList.contains("hidden")) {
    detailView.classList.add("hidden");
  } else {
    detailView.classList.remove("hidden");
  }
});

const heartBtn = document.querySelector(".heartUserDetailBtn");
heartBtn.addEventListener("click", async () => {
  const detailView = document.querySelector(".userFavoriteDetailContainer");
  const isbn = document.querySelector(".isbnDetail");
  if (!detailView.classList.contains("hidden")) {
    for (obj of allFavorites) {
      if (isbn.innerHTML === obj.ISBN) {
        console.log("save favorite", obj._id);
        let response = await callToggleHeart(obj.ISBN);
        if (response === "added") {
          console.log("ADDED");
          fillHeart();
          rootVars.style.setProperty("--heartAnimation", "beating");
          loadUserFavorites();
        } else if (response === "removed") {
          console.log("REMOVED");
          drainHeart();
          rootVars.style.setProperty("--heartAnimation", "coding");
          loadUserFavorites();
        }
      }
    }
  }

  console.log();
});

const fillHeart = () => {
  rootVars.style.setProperty("--heartFillFront", `rgba(160,10,10,.99)`);
  rootVars.style.setProperty("--heartFillBack", `rgba(150,0,0,.99)`);
};

const drainHeart = () => {
  rootVars.style.setProperty("--heartFillFront", `rgba(160,10,10,.2)`);
  rootVars.style.setProperty("--heartFillBack", `rgba(150,0,0,.2)`);
};

//Add comment
const addCommentBtn = document.querySelector(".submitComment");
addCommentBtn.addEventListener("click", async () => {
  const commentInput = document.querySelector(".commentInput");
  const isbn = document.querySelector(".isbnDetail");
  await addNewComment(isbn.innerHTML, commentInput.value);
  commentInput.value = "";
  loadUserFavorites();
  loadAllFavorites();
  const singleBook = await loadOne(isbn.innerHTML);
  buildDetail(singleBook);
});

//#endregion
