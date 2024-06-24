defmodule ElCloud.FileStorageControllerTest do
  use ElCloud.DataCase
  use ExUnit.CaseTemplate
  alias ElCloudWeb.Router.Helpers, as: Routes

  describe "index" do
    test "lists all files", %{conn: conn} do
      conn = get(conn, Routes.post_path(conn, :index))
      assert json_response(conn, 200) =~ %{"data": FileStorage.list_files(directory, page, real_page_size, is_recursive)}
    end
  end



end
