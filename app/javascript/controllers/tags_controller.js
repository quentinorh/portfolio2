import { Controller } from "@hotwired/stimulus"

<<<<<<< HEAD
// Connects to data-controller="tags"
=======
>>>>>>> b1061df5e30387f8557abba7298717ea4a1fbe85
export default class extends Controller {
  static targets = ["tags", "fabTag", "photoTag", "graphTag", "devTag", "envTag"]
  static values = {
    content: String,
  }

  connect() {
<<<<<<< HEAD
    console.log("Hellooooouuu World!")

=======
>>>>>>> b1061df5e30387f8557abba7298717ea4a1fbe85
    if (this.tagsTarget.innerHTML.includes("Fabrication")){
      this.fabTagTarget.classList.add("fab-icon-2")
    }
    if (this.tagsTarget.innerHTML.includes("Photographie")){
      this.photoTagTarget.classList.add("photo-icon-2")
    }
    if (this.tagsTarget.innerHTML.includes("Graphisme")){
      this.graphTagTarget.classList.add("graph-icon-2")
    }
    if (this.tagsTarget.innerHTML.includes("Développement")){
      this.devTagTarget.classList.add("dev-icon-2")
    }
    if (this.tagsTarget.innerHTML.includes("Environnement")){
      this.envTagTarget.classList.add("env-icon-2")
    }
  }
}
