Vue.component("register", {
  props: {
    form: Object
  },
  template: `
  <div class="container">
    <div class="row">
      <div class="col-sm-4 offset-4">
        <form @submit.prevent="goRegister">
          <div class="form-group">
            <label for="username">username</label>
            <input type="text" class="form-control" id="usernameRegister" aria-describedby="emailHelp" placeholder="Enter username" v-model.trim="form.username" required>
            <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
          </div>
          <div class="form-group">
            <label for="email">Email address</label>
            <input type="email" class="form-control" id="emailRegister" aria-describedby="emailHelp" placeholder="Enter email" v-model.trim="form.email" required>
            <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control" id="passwordRegister" placeholder="Password" v-model.trim="form.password" required>
          </div>
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control" id="nameRegister" placeholder="Enter name" v-model="form.name" required>
            <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
          </div>
          <div class="form-group">
            <label for="age">Age</label>
            <input type="number" class="form-control" id="ageRegister" v-model="form.age" required>
            <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
          </div>
          <button type="submit" class="btn btn-primary">Register</button>
          </form>
        </div>
      </div>
    </div>
  `,
  methods: {
    goRegister() {
      this.$emit("do-register", this.form);
    }
  }
});
