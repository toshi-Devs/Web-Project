// const axios = require('axios');
// import axios from 'axios';

const BackendUrl = 'http://localhost:3000';

const RegisterSubmit = async (formData) => {
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');

  //validate form if it's empty return error and put in on the warningMessage
  if (username.trim() === '' || email.trim() === '' || password.trim() === '') {
    const warningMessage = document.getElementById('RegisterWarningMessage');
    warningMessage.innerText = 'Please fill all fields!';
    return false;
  } else {
    const warningMessage = document.getElementById('RegisterWarningMessage');
    warningMessage.innerText = '';
  }
  // const warningMessage = document.getElementById('warningMessage');

  // console.log(username, email, password);
  try {
    const res = await axios.post(`${BackendUrl}/auth/register`, {
    username,
    email,
    password
  })

  // redirect to home page
    setTimeout(() => window.location.href = "./index.html" , 2000);

  // Show confirmation message
  const toastLiveExample = document.getElementById('regToast');
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastBootstrap.show()

  
  // window.location.href = "#LoginModal";
  } catch (error) { 
    console.error("cyka error : " + error);
    const warningMessage = document.getElementById('RegisterWarningMessage');
    warningMessage.innerText = "Failed to Create User!";
  }
}

const LoginSubmit = async (formData) => {
  const username = formData.get('username');
  const password = formData.get('password');

  //validate form if it's empty return error and put in on the warningMessage
  if (username.trim() === '' || password.trim() === '') {
    const warningMessage = document.getElementById('LoginWarningMessage');
    warningMessage.innerText = 'Please fill all fields!';
    return false;
  } else {
    const warningMessage = document.getElementById('LoginWarningMessage');
    warningMessage.innerText = '';
  }

  try {
    const res = await axios.post(`${BackendUrl}/auth/login`, {
      username,
      password
    });

    console.log(res.data);
    // set user to local storage
    localStorage.setItem("user", JSON.stringify(res.data));
    console.log(res.data.token);

    // set token to local storage
    localStorage.setItem("token", res.data.token);

    // redirect to home page
    setTimeout(() => window.location.href = "./index.html" , 2000); 

    // Show confirmation message
    const toastLiveExample = document.getElementById('loginToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show()
    
  } catch (error) { 
    console.error("cyka error : " + error);
    const warningMessage = document.getElementById('LoginWarningMessage');
    warningMessage.innerText = "Invalid Credentials!";
  }
}


const interestImages = {
'Anime & Manga': '/img/icon1.jpg',
'Latest News': '/img/icon2.jpg',
'Humor': '/img/icon3.jpg',
'Memes': '/img/icon4.jpg',
'Gaming': '/img/icon5.jpg',
'WTF': '/img/icon6.jpg',
'Relationship & Dating': '/img/icon7.jpg',
'Sports': '/img/icon8.jpg',
'Wholesome': '/img/icon9.jpg',
};

// const getPosts = async () => {
//   try {
//     const response = await axios.get(`${BackendUrl}/posts`);
//     const posts = response.data;
//     console.log(posts);
//     const postsContainer = document.getElementById('postsContainer');
//     postsContainer.innerHTML = '';
//     posts.forEach(post => {
//       const postElement = document.createElement('div');
//       postElement.className = 'card mb-3 text-white';
//       postElement.style = 'background-color: #1d1d1d;';
//       const interestImage = interestImages[post.interest];
//       postElement.innerHTML = `
//         <div class="card-body">
//           <p class="card-text"><img src="${interestImage}" alt="${post.interest} Logo" id="InterestLogoImg" class="interest-image" />${post.interest}</p>
//           <h3 class="card-title">${post.title}</h5>
//           <img src=${post.url} class="card-img-top" alt="post">
//           <div class="PostIcons d-flex gap-5 m-2 p-2 text-secondary" id="PostIcons"> 
//             <i class="bi bi-arrow-up-square-fill"> Up</i>
//             <i class="bi bi-arrow-down-square-fill"> Down</i>
//             <i class="bi bi-chat-left-text"><span> Comment</span></i>
//             <i class="bi bi-share"> <span>Share</span></i>
//           </div>
//         </div>
//       `;
//       const icons = postElement.querySelectorAll('i');
//       icons.forEach(icon => {
//         icon.style.cursor = 'pointer';
//         icon.style.gap = '0.5rem';
//         icon.style.fontSize = '1.2rem';
//         icon.style.display = 'flex';
//         icon.style.alignItems = 'center';
//         icon.style.padding = '0.5rem';
//         icon.style.borderRadius = '0.5rem';
//         icon.onmouseover = function() {
//           icon.style.backgroundColor = 'whitesmoke';
//         };
//         icon.onmouseout = function() {
//           icon.style.backgroundColor = 'transparent';
//         };
//         icon.addEventListener('click', () => {
//           console.log('Icon clicked:', icon);
//         });
//       });
//       postsContainer.appendChild(postElement); // I will add btns to react
//     });
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//   }
// };


// window.onload = getPosts();

document.querySelectorAll('.Sidebar-Categories li').forEach(item => {
  item.addEventListener('click', function() {
      const category = this.querySelector('span').textContent;
      filterPostsByCategory(category);
      console.log('Category clicked:', category);
  });
});

const filterPostsByCategory = async (category) => {
  try {
      const response = await axios.get(`${BackendUrl}/posts?category=${category}`);
      const posts = response.data;
      displayFilteredPosts(posts);
  } catch (error) {
      console.error('Error fetching filtered posts:', error);
  }
};

const displayFilteredPosts = (posts) => {
  const postsContainer = document.getElementById('postsContainer');
  postsContainer.innerHTML = '';
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'card mb-3 text-white';
    postElement.style = 'background-color: #1d1d1d;';
    const interestImage = interestImages[post.interest];
    postElement.innerHTML = `
      <div class="card-body">
        <p class="card-text"><img src="${interestImage}" alt="${post.interest} Logo" id="InterestLogoImg" class="interest-image" />${post.interest}</p>
        <h3 class="card-title">${post.title}</h5>
        <img src=${post.url} class="card-img-top" alt="post">
        <div class="PostIcons d-flex gap-5 m-2 p-2 text-secondary" id="PostIcons"> 
          <i class="bi bi-arrow-up-square-fill"> Up</i>
          <i class="bi bi-arrow-down-square-fill"> Down</i>
          <i class="bi bi-chat-left-text"><span> Comment</span></i>
          <i class="bi bi-share"> <span>Share</span></i>
        </div>
      </div>
    `;
    const icons = postElement.querySelectorAll('i');
    icons.forEach(icon => {
      icon.style.cursor = 'pointer';
      icon.style.gap = '0.5rem';
      icon.style.fontSize = '1.2rem';
      icon.style.display = 'flex';
      icon.style.alignItems = 'center';
      icon.style.padding = '0.5rem';
      icon.style.borderRadius = '0.5rem';
      icon.onmouseover = function() {
        icon.style.backgroundColor = 'whitesmoke';
      };
      icon.onmouseout = function() {
        icon.style.backgroundColor = 'transparent';
      };
      icon.addEventListener('click', () => {
        console.log('Icon clicked:', icon);
      });
    });
    postsContainer.appendChild(postElement); // I will add btns to react
  });
};

// Creating a post using the form

const createPost = async (formData) => {
  const title = formData.get('title');
  const url = formData.get('url');
  const selectElement = document.querySelector('.form-select');
  const selectedOption = selectElement.selectedOptions[0]; // Get the selected option
  const interest = selectedOption.textContent; // Get the text content of the selected option


  console.log(title, url, interest);

  if (title.trim() === '' || url.trim() === '' || interest.trim() === '') {
    const warningMessage = document.getElementById('CreatePostWarningMessage');
    warningMessage.innerText = 'Please fill all fields!';
    return false;
  }

  try {
    const res = await axios.post(`${BackendUrl}/posts/create`, {
    title,
    url,
    interest
  })
  console.log(res.data);
  getPosts();
  document.getElementById('createPostForm').reset();

  // redirect to home page
  setTimeout(() => window.location.href = "./index.html" , 2000);

  // Show confirmation message
  const toastLiveExample = document.getElementById('createToast');
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastBootstrap.show()

  } catch (error) {
    console.error("cyka error : " + error);
    const warningMessage = document.getElementById('CreatePostWarningMessage');
    warningMessage.innerText = "Failed to create post!";
  }
}


document.getElementById('createPostForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent the default form submission behavior
  const formData = new FormData(this);
  createPost(formData);
});

document.getElementById('createNewPostBtn').addEventListener('click', function(e) {
  e.preventDefault(); // Prevent the default button click behavior
  const formData = new FormData(document.getElementById('createPostForm'));
  createPost(formData);
});




document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent the default form submission behavior
  const formData = new FormData(this);
  RegisterSubmit(formData);
  showLoggedInUserInfo();
});

document.getElementById('registerBtn').addEventListener('click', function(e) {
  e.preventDefault(); // Prevent the default button click behavior
  const formData = new FormData(document.getElementById('registerForm'));
  RegisterSubmit(formData);
  showLoggedInUserInfo();
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent the default form submission behavior
  const formData = new FormData(this);
  LoginSubmit(formData);
  showLoggedInUserInfo();
});

document.getElementById('loginBtn').addEventListener('click', function(e) {
  e.preventDefault(); // Prevent the default button click behavior
  const formData = new FormData(document.getElementById('loginForm'));
  LoginSubmit(formData);
  showLoggedInUserInfo();
});

// Shuffle posts
// document.getElementById('shuffleButton').addEventListener('click', function() {
//   shufflePosts();
// });

// const shufflePosts = async () => {
//   try {
//     const response = await axios.get(`${BackendUrl}/posts`);
//     const posts = response.data;
//     const shuffledPosts = shuffleArray(posts);
//     displayFilteredPosts(shuffledPosts);
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//   }
// }

// const shuffleArray = (array) => {
//   const shuffledArray = [...array];
//   for (let i = shuffledArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
//   }
//   return shuffledArray;
// }


// Add this function to show logged-in user information in the header
function showLoggedInUserInfo() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    // Hide Login/Signup buttons
    document.getElementById("HeaderLoginBtn").style.display = "none";
    document.getElementById("HeadeRegisterBtn").style.display = "none";
    document.getElementById("SignUpCardPop").style.display = "none";
    // Show username in the header
    const headerRight = document.querySelector(".Header-right");
    const headerIcons = document.querySelector(".Header-icons")
    const usernameElement = document.createElement("span");
    usernameElement.textContent = `${user.username}!`;
    usernameElement.style.fontWeight = "bold"
    usernameElement.style.cursor = "pointer"

    // Add event listener to redirect to profile page
    usernameElement.addEventListener('click', function() {
      window.location.href = "profile.html"; // Change "profile.html" to the actual URL of your profile page
    });

    const logoutButton = document.createElement("button");
    logoutButton.textContent = "Logout";
    logoutButton.setAttribute('class', 'btn btn-danger text-white me-2')
    logoutButton.onclick = function() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setTimeout(() => window.location.href = "./index.html" , 2000);

      // Show confirmation message
      const toastLiveExample = document.getElementById('logoutToast');
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
      toastBootstrap.show()
    };
    headerIcons.appendChild(usernameElement);
    headerIcons.appendChild(logoutButton);
    
    // headerRight.appendChild(usernameElement);
    // headerRight.appendChild(logoutButton);
  }
    if (!user){
      const CreatePostModal = document.getElementById('CreatePosts');
    CreatePostModal.style.display = 'none';
    const CreatePostBtn = document.getElementById('CreatePostBtn');
    CreatePostBtn.style.display = 'none';
  }
}

const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastTrigger.addEventListener('click', () => {
    toastBootstrap.show()
  })
}


// Call this function when the page loads to check if the user is logged in
window.onload = showLoggedInUserInfo;

document.addEventListener('DOMContentLoaded', function() {
  getProfileInfo();
});


function getProfileInfo() {
  const user = JSON.parse(localStorage.getItem("user"));
  const profileContainer = document.getElementById("profileContainer");
  if (profileContainer) {
    if (user) {
      profileContainer.innerHTML = `
      <div class="page-content page-container" id="page-content">
      <div class="padding">
          <div class="row container d-flex justify-content-center">
  <div class="col-xl-12 col-md-12">
                                                  <div class="card user-card-full">
                                                      <div class="row m-l-0 m-r-0">
                                                          <div class="col-sm-4 bg-c-lite-green user-profile">
                                                              <div class="card-block text-center text-white">
                                                                  <div class="m-b-25">
                                                                      <img src="https://img.icons8.com/bubbles/100/000000/user.png" class="img-radius" alt="User-Profile-Image">
                                                                  </div>
                                                                  <div>
                                                                    <h6 class="f-w-600">${user.username}</h6>
                                                                    <p></p>
                                                                    <button id="editUserInfoButton"><i id="editIcon" class="mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i></button>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div id="colsm8" class="col-sm-8">
                                                              <div id="userDetails" class="card-block">
                                                                  <h6 class="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
                                                                  <div class="row">
                                                                      <div class="col-sm-6">
                                                                          <p class="m-b-10 f-w-600">Username</p>
                                                                          <h6 id="userNameHead" class="text-muted f-w-400">${user.username}</h6>
                                                                      </div>
                                                                      <div class="col-sm-6">
                                                                          <p class="m-b-10 f-w-600">Email</p>
                                                                          <h6 id="userEmail" class="text-muted f-w-400">${user.email}</h6>
                                                                      </div>
                                                                  </div>
                                                                  <h6 class="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">Activity</h6>
                                                                  <div class="row">
                                                                      <div class="col-sm-6">
                                                                          <p class="m-b-10 f-w-600">Posts</p>
                                                                          <h6 class="text-muted f-w-400">No Information</h6>
                                                                      </div>
                                                                      <div class="col-sm-6">
                                                                          <p class="m-b-10 f-w-600">Likes</p>
                                                                          <h6 class="text-muted f-w-400">No Information</h6>
                                                                      </div>
                                                                  </div>
                                                                  <ul class="social-link list-unstyled m-t-40 m-b-10">
                                                                      <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="facebook" data-abc="true"><i class="mdi mdi-facebook feather icon-facebook facebook" aria-hidden="true"></i></a></li>
                                                                      <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="twitter" data-abc="true"><i class="mdi mdi-twitter feather icon-twitter twitter" aria-hidden="true"></i></a></li>
                                                                      <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="instagram" data-abc="true"><i class="mdi mdi-instagram feather icon-instagram instagram" aria-hidden="true"></i></a></li>
                                                                  </ul>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                               </div>
                                                  </div>
                                              </div>
      `;
      
      // Add event listener to the edit button
      const editProfileBtn = document.getElementById("editUserInfoButton");
      const saveButtonLocation = document.getElementById("userDetails");
      
      editProfileBtn.addEventListener("click", function(e) {
        e.preventDefault(); 
                    
          // Enable editing for name, username, and email
          const userName = document.getElementById('userNameHead');
          const userEmail = document.getElementById('userEmail');
        
          // Allow user to edit the username and email
          userName.contentEditable = true;
          userEmail.contentEditable = true;
          userName.style.borderRadius = '0.3rem';
          userName.style.border = '1px solid #D8D8D8'; 
          userEmail.style.borderRadius = '0.3rem';
          userEmail.style.border = '1px solid #D8D8D8'; 
          
        
          // Add a save button to save the changes
          const saveButton = document.createElement('button');
          saveButton.textContent = 'Save';
          saveButton.classList.add('btn', 'btn-primary', 'mt-2');
          saveButton.id = 'saveProfileButton';
          
          saveButton.addEventListener('click', function() {
            // Save the changes to the backend
            const updateProfile = {
              username: userName.textContent.trim(),
              email: userEmail.textContent.trim(),
            };
        
            // Make a PUT request to update the post
            axios.put(`${BackendUrl}/users/${user.id}`, updateProfile)
              .then((response) => {
                // Handle success
                console.log('Profile updated successfully:', response.data);
                // Update user object in local storage
                const updatedUser = { ...user, ...updateProfile };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                // Optionally, disable editing mode after saving
                userName.contentEditable = false;
                userName.style.border = 'none';
                userEmail.contentEditable = false;
                userEmail.style.border = 'none';
                saveButton.remove();
              })
              .catch((error) => {
                console.error('Error updating post:', error);
              });
          });
          saveButtonLocation.appendChild(saveButton);
        });      
    }
  }  
}