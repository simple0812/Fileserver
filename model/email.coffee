nodemailer = require "nodemailer"
#$ = require 'jquery'


class Email

  DefaultFrom = "1992134042@qq.com"
  smtpTransport = nodemailer.createTransport "SMTP",{
    service: "qq",
    auth: {
      user: "1992134042@qq.com",
      pass: "qioushuo8215"
    }
  }

  constructor: (@mailOptions, @from = DefaultFrom) ->


  send: (callback) ->
    mailOptions = @mailOptions
    mailOptions.from = @from
    smtpTransport.sendMail mailOptions, (error, response) ->
      if error? callback(error, null)
      else callback(null, response)
#    $sendDeferred = new $.Deferred()
#    $sendPromise = $sendDeferred.promise()
#    mailOptions = @mailOptions
#    mailOptions.from = @from
#    smtpTransport.sendMail mailOptions, (error, response) ->
#      if error? $sendDeferred.resolve(error, null)
#      else $sendDeferred.resolve(null, response)
#    return $sendPromise

exports = module.exports = Email





