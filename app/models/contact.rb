class Contact < MailForm::Base
  attribute :name, validate: true
  attribute :email, validate: /\A[^@\s]+@[^@\s]+\z/i
  attribute :message, validate: true
  attribute :nickname, captcha: true

  def headers
    {
      subject: "My Contact Form",
      to: "quentin.orhant@mailo.fr",
      from: %("#{name}" <#{email}>)
    }
  end
end
