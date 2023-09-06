import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="pictures"
export default class extends Controller {
static values = {
  postid: String,
}
  connect() {
    console.log("Hello World!")
  }

  deletePicture(e) {
    e.currentTarget.classList.toggle('display-none');
    const formData = new FormData()
    formData.append("photo_id", e.currentTarget.querySelector(".delete-img").dataset.picturePhotoidValue)
    fetch(`/posts/${this.postidValue}/delete_photo`, {
      method: "PATCH",
      headers: {
        "Accept": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute('content')},
      body: formData
    })
  }
}
