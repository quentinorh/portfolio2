import { Controller } from "@hotwired/stimulus"

<<<<<<< HEAD
// Connects to data-controller="pictures"
export default class extends Controller {
static values = {
  postid: String,
}
  connect() {
    console.log("Hello World!")
=======
export default class extends Controller {
static values = {
  postslug: String,
}
  connect() {
>>>>>>> b1061df5e30387f8557abba7298717ea4a1fbe85
  }

  deletePicture(e) {
    e.currentTarget.classList.toggle('display-none');
    const formData = new FormData()
    formData.append("photo_id", e.currentTarget.querySelector(".delete-img").dataset.picturePhotoidValue)
<<<<<<< HEAD
    fetch(`/posts/${this.postidValue}/delete_photo`, {
=======
    fetch(`/${this.postslugValue}/delete_photo`, {
>>>>>>> b1061df5e30387f8557abba7298717ea4a1fbe85
      method: "PATCH",
      headers: {
        "Accept": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute('content')},
      body: formData
    })
  }
}
