class UsersController < ApplicationController
    before_action :require_token, only: [:validate]

    def validate
        render json: @current_user.json_hash
    end

    def create
        puts user_params.inspect
        @user = User.new(user_params)
        if @user.valid?
            @user.save
            render json: @user.json_hash
        else
            puts @user.errors.messages.inspect
            render status: :bad_request, json: {
                errors: @user.errors.messages
            }
        end
    end

    private

    def user_params
        params.permit(:name, :email, :password, :password_confirmation)
    end
end
