class ContactsController < ApplicationController
<<<<<<< HEAD
  skip_before_action :authenticate_user!, only: [:new, :new2, :create, :sent]

  def new
    @contact = Contact.new
  end

  def new2
    @contact = Contact.new
=======
  skip_before_action :authenticate_user!, only: [:info, :message, :create, :sent]

  def info
    @contact = Contact.new
    @page_title = "Informations et contact"
    @meta_description = "Pour en savoir plus sur mes services et réalisations en éco-conception. Je suis là pour répondre à toutes vos questions et envisager des collaborations."
  end

  def message
    @contact = Contact.new
    @page_title = "Me contacter"
    @meta_description = "Pour en savoir plus sur mes services et réalisations en éco-conception. Je suis là pour répondre à toutes vos questions et envisager des collaborations."
>>>>>>> b1061df5e30387f8557abba7298717ea4a1fbe85
  end

  def create
    @contact = Contact.new(params[:contact])
    @contact.request = request
    if @contact.deliver
      redirect_to action: :sent
      # flash.now[:success] = 'Message sent!'
    else
      flash.now[:error] = 'Could not send message'
      render :new, status: :unprocessable_entity
    end
  end

  def sent

  end
end
