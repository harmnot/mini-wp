const goAxios = axios.create({
  baseURL: `http://localhost:4000/api`
});

alertify.defaults.notifier.position = "top-center";
alertify.defaults.glossary.title = "Mini-WP";

new Vue({
  el: "#app",
  components: {
    wysiwyg: vueWysiwyg.default.component
  },
  data: {
    message: "Hello",
    somearticles: [],
    loaders: true,
    errors: [],
    areTheyLogin: localStorage.getItem("token") ? true : false,
    page: {
      login: false,
      register: false,
      homepage: true,
      dashboard: false,
      writearticle: false
    },
    forms: {
      username: null,
      email: null,
      password: null,
      name: null,
      age: null
    },
    loginforms: {
      username: null,
      password: null
    },
    con: "",
    article: {
      edit: null,
      content: null,
      placeholder: "write your content..",
      title: null,
      addArticle: false,
      editContent: null
    },
    imageS: null,
    tryingUpload: false
  },
  watch: {
    // forms: {
    //   handler: function(n, x) {
    //     console.log(n.username);
    //     console.log(x.username);
    //   },
    //   deep: true
    // },
  },
  methods: {
    onSigIn(googleUser) {
      // console.log(googleUser);
      console.log(this.$parent);
      const profile = googleUser.getBasicProfile();
      console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log("Name: " + profile.getName());
      console.log("Image URL: " + profile.getImageUrl());
      console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
      this.areTheyLogin = true;
      const id_token = googleUser.getAuthResponse().id_token;
      // const { data } = await
      // this.page.dashboard = true;
      // this.areTheyLogin = true;

      goAxios
        .post("/user/logingoogle", {
          token: id_token
        })
        .then(({ data }) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.user);
          this.isSignin();
          this.page.dashboard = true;
          this.page.login = false;
          this.page.register = false;
          this.page.homepage = false;
        })
        .catch(err => alertify.error(err.response.data.error));
    },
    googleFailed(error) {
      alertify.error(error);
    },
    async getAllArticles() {
      this.loaders = true;
      try {
        const { data } = await goAxios.get("/article/random");
        this.loaders = false;
        this.somearticles = data;
      } catch (err) {
        this.loaders = false;
        alertify.error(err.response.data.error);
      }
    },
    async handleRegister() {
      if (!this.forms.username) {
        this.errors.push("please fill your username");
      }
      if (!this.forms.email) {
        this.errors.push("please with valid email");
      }
      if (!this.forms.password) {
        this.errors.push("please fill your password");
      }

      if (!this.forms.name) {
        this.errors.push(`please fill your name`);
      }
      if (!this.forms.age) {
        this.errors.push(`please fill your age`);
      } else if (this.forms.age < 10) {
        this.errors.push(`we only allow age older than 10 years old`);
      }

      if (this.errors.length >= 1) {
        for (let i of this.errors) {
          alertify.error(i);
        }
        this.errors = [];
      } else if (this.errors == 0) {
        const obj = {
          username: this.forms.username,
          email: this.forms.email,
          password: this.forms.password,
          name: this.forms.name,
          age: this.forms.age
        };
        try {
          const { data: goregister } = await goAxios.post(
            "/user/register",
            obj
          );
          console.log(goregister);
          this.page.register = false;
          this.page.login = true;
          this.page.homepage = false;
          alertify.success("success fully to register");
        } catch (err) {
          if (err.response.status > 400 && err.response.status < 500) {
            alertify.error(err.response.data.error);
            this.form.username = "";
            this.form.email = "";
          } else {
            alertify.error(err.response.data.error);
          }
        }
      }
    },
    async handleLogin() {
      try {
        const { data } = await goAxios.post("/user/login", {
          input: this.loginforms.username,
          password: this.loginforms.password
        });
        localStorage.setItem("userId", data.user);
        localStorage.setItem("token", data.token);
        this.page.dashboard = true;
        this.areTheyLogin = true;
        this.page.login = false;
        this.page.register = false;
        this.page.homepage = false;
        alertify.success("berhasil login");
      } catch (err) {
        if (err.response.status > 400 && err.response.status < 500) {
          alertify.error(err.response.data.error);
        } else {
          alertify.error(err.response.data.error);
        }
      }
    },
    async handleDelete(id) {
      try {
        const headers = {
          headers: localStorage.getItem("token")
        };
        const { data } = await goAxios.delete("/article/" + id, {
          headers: {
            token: localStorage.getItem("token")
          }
        });
        this.$nextTick(() => {
          this.goProfiles();
        });
        alertify.success("berhasil deleted");
      } catch (err) {
        alertify.error(err.response.data.error);
      }
    },
    handleAddArticle() {
      if (!this.article.title) {
        this.errors.push(`you should write correctly in your title form`);
      }

      if (!this.$refs.content.$el.innerText) {
        this.errors.push(`you should write correctly in your content`);
      }

      if (this.errors.length >= 1) {
        for (i of this.errors) {
          alertify.error(i);
        }
      } else {
        this.page.writearticle = false;
        this.page.dashboard = true;
        goAxios
          .post(
            "/article/createarticle",
            {
              title: this.article.title,
              content: this.article.content
            },
            {
              headers: {
                token: localStorage.getItem("token")
              }
            }
          )
          .then(({ data }) => {
            this.page.writearticle = false;
            console.log(data, "iniiii data article ditabamah");
            alertify.success("success add article");
          })
          .catch(err => {
            this.page.writearticle = false;
            alertify.error(err.response.data.error);
          });
      }
    },
    async handleUpdateArticle() {
      try {
        const id = this.article.editContent;
        this.page.writearticle = false;
        this.page.dashboard = true;
        const { data } = await goAxios.put(
          "/article/" + id,
          {
            title: this.article.title,
            content: this.article.content
          },
          {
            headers: {
              token: localStorage.getItem("token")
            }
          }
        );
        alertify.success("success update article");
        // this.page.dashboard = true;
      } catch (err) {
        this.page.writearticle = false;
        alertify.error(err.response.data.error);
      }
    },
    toLogin() {
      this.page.login = true;
      this.page.register = false;
      this.page.homepage = false;
    },
    toHomePage() {
      this.page.login = false;
      this.page.writearticle = false;
      this.page.register = false;
      this.page.homepage = true;
      this.page.dashboard = false;
    },
    toLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      const auth2 = gapi.auth2.getAuthInstance();
      if (!auth2) {
        window.location.reload();
        this.areTheyLogin = false;
        this.page.dashboard = false;
        alertify.success("you are logging out now");
        this.page.homepage = true;
        this.page.writearticle = false;
        this.page.writearticle = false;
      } else {
        auth2.signOut().then(function() {
          window.location.reload();
          console.log("User signed out.");
        });
        window.location.reload();
        this.areTheyLogin = false;
        this.page.dashboard = false;
        alertify.success("you are logging out now");
        this.page.homepage = true;
        this.page.writearticle = false;
        this.page.writearticle = false;
      }
    },
    toRegister() {
      this.page.register = true;
      this.page.login = false;
      this.page.homepage = false;
    },
    swapDashboard() {
      this.page.register = false;
      this.page.writearticle = false;
      this.page.login = false;
      this.page.homepage = false;
      this.page.dashboard = true;
    },
    addArticle() {
      this.article.edit = "";
      this.article.content = "";
      this.article.title = "";
      this.article.addArticle = true;
      this.page.writearticle = true;

      this.page.register = false;
      this.page.login = false;
      this.page.dashboard = false;
      this.page.homepage = false;
    },
    readMore(el) {
      alertify.minimalDialog ||
        alertify.dialog("minimalDialog", function() {
          return {
            main: function(content) {
              this.setContent(content);
            },
            hooks: {
              onshow: function() {
                this.elements.dialog.style.maxWidth = "none";
                this.elements.dialog.style.width = "80%";
                this.elements.dialog.style.height = "80%";
              }
            }
          };
        });
      alertify.minimalDialog(`
        <div class="container">
      <h2> ${el.title} </h2>
      <p> ${el.content} </p>
        </div>
      `);
    },
    readmoreDashboard(val) {
      alertify.minimalDialog ||
        alertify.dialog("minimalDialog", function() {
          return {
            main: function(content) {
              this.setContent(content);
            },
            hooks: {
              onshow: function() {
                this.elements.dialog.style.maxWidth = "none";
                this.elements.dialog.style.width = "80%";
                this.elements.dialog.style.height = "80%";
              }
            }
          };
        });
      alertify.minimalDialog(`
        <div class="container">
      <h2> ${val.title} </h2>
      <p> ${val.content} </p>
        </div>
      `);
    },
    editContent(val) {
      this.page.register = false;
      this.page.login = false;
      this.page.dashboard = false;
      this.article.title = val.title;
      this.article.content = val.content;
      this.article.addArticle = false;
      this.page.writearticle = true;
      this.article.editContent = val._id;
    },
    isSignin() {
      if (localStorage.getItem("token")) {
        return true;
      } else {
        return false;
      }
    },
    uploadthispic() {
      if (!this.imageS) {
        alertify.error("please choose your pic");
      } else {
        let dataFormat = new FormData();
        dataFormat.append("image", this.imageS);
        this.tryingUpload = true;
        axios
          .post("http://localhost:4000/api/upload", dataFormat, {
            headers: {
              token: localStorage.getItem("token")
            }
          })
          .then(({ data }) => {
            this.tryingUpload = false;
            alertify.success("successfully upload pic");
          })
          .catch(err => {
            this.tryingUpload = false;
            alertify.error(err.response.data.error);
          });
      }
    },
    previewimage(e) {
      const file = e.target.files[0];
      this.imageS = this.$refs.inputfile.files[0];
      console.log(this.imageS, "ini this images");
    }
  },
  updated() {},
  created() {
    this.getAllArticles();
  },
  mounted() {
    if (localStorage.getItem("token")) {
      this.areTheyLogin = true;
    } else {
      this.areTheyLogin = false;
    }
  }
});
