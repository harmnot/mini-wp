const goAxios = axios.create({
  baseURL: `http://localhost:4000/api`
});

alertify.defaults.notifier.position = "top-center";

new Vue({
  el: "#app",
  data: {
    articles: [],
    button: {
      writeHasToken: false
    },
    page: {
      register: false,
      homepage: true,
      thislogin: false,
      articlePage: false,
      loader: false,
      loader2: false,
      dashboard: false
    },
    kelas: {
      isA: true,
      isB: false
    },
    errors: [],
    form: {
      username: null,
      email: null,
      password: null,
      name: null,
      age: null
    },
    loginform: {
      username: null,
      email: null
    },
    author: {
      articles: null
    }
  },
  created() {
    this.getAllArticles();
  },
  methods: {
    goRegister() {
      if (!this.form.username) {
        this.errors.push("please fill your username");
      }
      if (!this.form.email) {
        this.errors.push("please with valid email");
      }
      s;
      if (!this.form.password) {
        this.errors.push("please fill your password");
      }

      if (!this.form.name) {
        this.errors.push(`please fill your name`);
      }
      if (!this.form.age) {
        this.errors.push(`please fill your age`);
      } else if (this.form.age < 10) {
        this.errors.push(`we only allow age older than 10 years old`);
      }

      if (this.errors.length >= 1) {
        for (let i of this.errors) {
          alertify.error(i);
        }
        this.errors = [];
      } else if (this.errors == 0) {
        let obj = {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          name: this.form.name,
          age: this.form.age
        };
        goAxios
          .post("/user/register", obj)
          .then(berhasil => {
            console.log(berhasil);
            alertify.success("berhasil daftar");
            this.page.thislogin = true;
            this.page.register = false;
          })
          .catch(err => {
            if (err.response.status > 400 && err.response.status < 500) {
              alertify.error(err.response.data.error);
              this.form.username = "";
              this.form.email = "";
            } else {
              alertify.error(err.response.data.error);
            }
          });
      }
    },
    swapLogin() {
      this.page.register = false;
      this.kelas.isA = false;
      this.kelas.isB = true;
      this.page.thislogin = true;
      this.page.homepage = false;
    },
    swapRegister() {
      this.page.register = true;
      this.kelas.isA = false;
      this.kelas.isB = true;
      this.page.homepage = false;
      this.page.thislogin = false;
    },
    swapHomepage() {
      this.page.register = false;
      this.kelas.isA = true;
      this.kelas.isB = false;
      this.page.homepage = true;
      this.page.thislogin = false;
    },
    getAllArticles() {
      this.page.loader = true;
      goAxios
        .get("/article/allarticles")
        .then(({ data }) => {
          this.page.loader = false;
          this.page.articlePage = true;
          this.articles = data;
        })
        .catch(err => {
          this.page.loader = false;
          alertify.error(err.error);
        });
    },
    goLogin() {
      goAxios
        .post("/user/login", {
          input: this.loginform.username,
          password: this.loginform.password
        })
        .then(({ data }) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.user);
          this.page.dashboard = true;
          this.page.loader2 = true;
          this.goProfile();
          this.page.thislogin = false;
          alertify.success("berhasil login");
        })
        .catch(err => {
          if (err.response.status > 400 && err.response.status < 500) {
            alertify.error(err.response.data.error);
          } else {
            alertify.error(err.response.data.error);
          }
        });
    },
    goProfile() {
      let id = localStorage.getItem("userId");
      goAxios
        .get("/user/myarticle/" + id)
        .then(({ data }) => {
          this.page.loader2 = false;
          this.author.articles = data;
          this.page.profile = true;
        })
        .catch(err => {
          this.page.loader2 = false;
          alertify.error(err.response.data.error);
        });
    },
    deleteArticle(ev, i) {
      let token = localStorage.getItem("token");
      goAxios
        .delete("/article/" + this.author.articles.articles[i]._id, {
          headers: {
            token
          }
        })
        .then(({ data }) => {
          console.log(data, "ini deleted");
          alertify.success("berhasil deleted");
        })
        .catch(err => {
          console.log(err.response);
          alertify.error(err.error);
        });
    }
  },
  updated() {
    this.$nextTick(() => {
      this.goProfile();
    });
  }
}).$mount("#app");
