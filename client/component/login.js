Vue.component("login", {
  props: {
    loginform: Object
  },
  template: `
  <div class="container">
    <div class="row">
      <div class="col-sm-4 offset-4">
        <form @submit.prevent="goLogin">
          <div class="form-group">
            <label for="usernamelogin">Username or Email</label>
            <input type="text" class="form-control" id="usernameLogin" aria-describedby="emailHelp" placeholder="Enter username or email" v-model.trim="loginform.username" required>
            <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
          </div>
          <div class="form-group">
            <label for="passwordlogin">Password</label>
            <input type="password" class="form-control" id="passwordLogin" placeholder="Password" v-model.trim="loginform.password" required>
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  </div>
  `,
  methods: {
    goLogin() {
      this.$emit("dologin", this.loginform);
    }
  }
});
