import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
static values = {
  postslug: String,
}
  connect() {
  }

  deletePicture(e) {
    e.currentTarget.classList.toggle('display-none');
    const formData = new FormData()
    formData.append("photo_id", e.currentTarget.querySelector(".delete-img").dataset.picturePhotoidValue)
    fetch(`/${this.postslugValue}/delete_photo`, {
      method: "PATCH",
      headers: {
        "Accept": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute('content')},
      body: formData
    })
  }
}
