Vue.component("navbar", {
  props: {
    isloggin: Boolean,
    googlesigin: Function,
    failedgoogle: Function
  },
  template: `
  <div class="container" id="nap">
    <div class="d-flex">
      <div class="mr-auto p-2">logo</div>
      <div class="p-2">
        <button class="btn btn-secondary" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click="$emit('page-home')">
          Home
        </button >
      </div>
      <template v-if="isloggin">
      <div class="p-2"><button class="btn btn-info" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click="$emit('page-writearticle')">
        Write Article
        </button></div>
        <div class="p-2"><button class="btn btn-info" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click="$emit('page-dashboard-page')">
            Profile
          </button></div>
        <div class="p-2"><button class="btn btn-info" type="button"  aria-haspopup="true" aria-expanded="false" @click="$emit('page-logout')">
            Logout
          </button></div>
      </template>
          <template v-else>
      <div class="p-2"><button class="btn btn-info" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click="$emit('page-login')">
          Login
        </button></div>
      <div class="p-2"><a ref="google_sign" id="my-signin2" class="g-signin2" data-theme="dark"></a></div>
      <div class="p-2"><button class="btn btn-info" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click="$emit('page-register')">
          Register
        </button></div>
        </template>
    </div>
  </div>
  `,
  mounted() {
    gapi.signin2.render("my-signin2", {
      onsuccess: this.googlesigin,
      onfailure: this.failedgoogle
    });
  }
});
