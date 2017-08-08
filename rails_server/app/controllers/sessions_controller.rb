class SessionsController < ApplicationController
    def create
        @user = User.find_by_email(params[:email].downcase)
        if @user
            if @user.authenticate(params[:password])
                render json: @user.json_hash
            else
                render status: :unauthorized, json: {
                    password: ['Incorrect Password']
                }
            end
        else
            render status: :unauthorized, json: {
                email: ['Incorrect Email']
            }
        end
    end
end
