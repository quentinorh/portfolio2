import { Controller } from "@hotwired/stimulus"
import flatpickr from "flatpickr"

export default class extends Controller {
  connect() {
    console.log("Hello console log!");
    flatpickr(this.element, {
    });
  }

  disconnect() {
    // Assurez-vous de détruire l'instance lors de la déconnexion pour éviter les fuites de mémoire
    if (this.fp) {
      this.fp.destroy();
      this.fp = null;
    }
  }
}
