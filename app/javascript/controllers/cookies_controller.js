import { Controller } from "stimulus";

export default class extends Controller {
  connect() {
    console.log("coookies");
    // Vérifiez si le cookie existe déjà
    if (!this.hasCookie("cookieBannerDismissed")) {
      this.element.style.display = "flex";
    }
  }

  close() {
    // Cachez le bandeau
    this.element.style.display = "none";

    // Ajoutez un cookie pour le cacher pendant 24 heures
    this.setCookie("cookieBannerDismissed", "true", 1);
  }

  hasCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
}
