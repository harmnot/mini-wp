Vue.component("google-sign-btn", {
  props: {
    onSigIn: Function
  },
  template: `
    <div>
      <a id="my-signin2" class="g-signin2" data-theme="dark"> </a>
    </div>
  `,
  mounted() {
    // window.gapi.load("auth2", () => {
    //   this.auth2 = window.gapi.auth2.init({
    //     client_id:
    //       "731257843-grg8ke9jd1214ut22tglmgvrej62pijj.apps.googleusercontent.com",
    //     cookiepolicy: "single_host_origin"
    //   });
    //   this.auth2.attachClickHandler(
    //     this.$refs.google_sign,
    //     {},
    //     onSigin => {
    //       this.$emit("go-google", onSigin);
    //     },
    //     error => console.log(error)
    //   );
    // });
    // gapi.signin2.render("my-signin2", {
    //   // this is the button "id"
    //   onsuccess: this.OnSigin // note, no "()" here
    // });
  }
});
