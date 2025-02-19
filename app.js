// Mock API functions
const mockAPI = {
    getContacts: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(JSON.parse(localStorage.getItem("contacts") || "[]"))
        }, 300)
      })
    },
    addContact: (contact) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const contacts = JSON.parse(localStorage.getItem("contacts") || "[]")
          contact.id = Date.now()
          contacts.push(contact)
          localStorage.setItem("contacts", JSON.stringify(contacts))
          resolve(contact)
        }, 300)
      })
    },
    updateContact: (contact) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const contacts = JSON.parse(localStorage.getItem("contacts") || "[]")
          const index = contacts.findIndex((c) => c.id === contact.id)
          if (index !== -1) {
            contacts[index] = contact
            localStorage.setItem("contacts", JSON.stringify(contacts))
            resolve(contact)
          }
        }, 300)
      })
    },
    deleteContact: (id) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const contacts = JSON.parse(localStorage.getItem("contacts") || "[]")
          const updatedContacts = contacts.filter((c) => c.id !== id)
          localStorage.setItem("contacts", JSON.stringify(updatedContacts))
          resolve()
        }, 300)
      })
    },
  }
  
  // DOM elements
  const contactForm = document.getElementById("contactForm")
  const contactItems = document.getElementById("contactItems")
  const submitBtn = document.getElementById("submitBtn")
  
  // State
  let contacts = []
  let editingContact = null
  
  // Load contacts on page load
  document.addEventListener("DOMContentLoaded", loadContacts)
  
  // Event listeners
  contactForm.addEventListener("submit", handleFormSubmit)
  
  // Functions
  async function loadContacts() {
    contacts = await mockAPI.getContacts()
    renderContacts()
  }
  
  function renderContacts() {
    contactItems.innerHTML = ""
    contacts.forEach((contact) => {
      const li = document.createElement("li")
      li.className = "contact-item"
      li.innerHTML = `
              <div class="contact-info">
                  <strong>${contact.firstName} ${contact.lastName}</strong>
                  <p>Phone: ${contact.phone}</p>
                  <p>Email: ${contact.email}</p>
              </div>
              <div class="contact-actions">
                  <button class="edit-btn" data-id="${contact.id}">Edit</button>
                  <button class="delete-btn" data-id="${contact.id}">Delete</button>
              </div>
          `
      contactItems.appendChild(li)
    })
  
    // Add event listeners for edit and delete buttons
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", handleEdit)
    })
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", handleDelete)
    })
  }
  
  async function handleFormSubmit(e) {
    e.preventDefault()
    const contact = {
      id: document.getElementById("contactId").value,
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
    }
  
    if (editingContact) {
      await mockAPI.updateContact(contact)
      editingContact = null
      alert(`Contact updated: ${contact.firstName} ${contact.lastName}`)
    } else {
      await mockAPI.addContact(contact)
      alert(`Contact added: ${contact.firstName} ${contact.lastName}`)
    }
  
    await loadContacts()
    resetForm()
  }
  
  function handleEdit(e) {
    const id = Number.parseInt(e.target.getAttribute("data-id"))
    editingContact = contacts.find((contact) => contact.id === id)
    if (editingContact) {
      document.getElementById("contactId").value = editingContact.id
      document.getElementById("firstName").value = editingContact.firstName
      document.getElementById("lastName").value = editingContact.lastName
      document.getElementById("phone").value = editingContact.phone
      document.getElementById("email").value = editingContact.email
      submitBtn.textContent = "Update Contact"
    }
  }
  
  async function handleDelete(e) {
    const id = Number.parseInt(e.target.getAttribute("data-id"))
    const contactToDelete = contacts.find((contact) => contact.id === id)
    if (contactToDelete) {
      if (confirm(`Are you sure you want to delete ${contactToDelete.firstName} ${contactToDelete.lastName}?`)) {
        await mockAPI.deleteContact(id)
        alert(`Contact deleted: ${contactToDelete.firstName} ${contactToDelete.lastName}`)
        await loadContacts()
      }
    }
  }
  
  function resetForm() {
    contactForm.reset()
    document.getElementById("contactId").value = ""
    submitBtn.textContent = "Add Contact"
    editingContact = null
  }
  
  