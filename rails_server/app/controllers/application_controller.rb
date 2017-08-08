class ApplicationController < ActionController::API
    def require_token
        @current_user = User.find_by(auth_token: params[:auth_token])

        unless @current_user
            render status: :unauthorized, json: { error: 'user not authorized' }
        end
    end
end
