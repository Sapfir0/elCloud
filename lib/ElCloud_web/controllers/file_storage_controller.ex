defmodule ElCloudWeb.FileStorageController do
  use ElCloudWeb, :controller
  use PhoenixSwagger
  alias ElCloud.FileStorage
  action_fallback ElCloudWeb.FallbackController

  @data_dir Application.get_env(:elCloud, ElCloudWeb.FileStorageController)[:data_dir]

  def send_response({:error, :enoent}, conn), do: {:error, :folderNotFound}
  def send_response(:ok, conn), do: render(conn, "show.json", file_storage: :ok)


  def swagger_definitions do
    %{
      File:
        swagger_schema do
          title("File")
          description("Get list of files in directory")

          properties do
            is_folder(:bool, "Is folder", required: true)
            children(:string, "List of children files", required: true)
            filename(:string, "Filename", required: true)
          end
        end,
      FileResponse:
        swagger_schema do
          title("File Response")
          description("Response schema for single file")
          property(:data, Schema.ref(:File), "The file details")
        end
    }
  end

  swagger_path(:index) do
    get("/api/files")
    summary("List files")
    description("List all files in directory")
    response(200, "OK", Schema.ref(:FileResponse))
  end
  def index(conn, params) do
    directory = @data_dir <> Map.get(params, "directory", "")
    {page, _} = Integer.parse(Map.get(params, "page",  "0"))
    is_recursive = !!Map.get(params, "is_recursive", false)
    page_size = Map.get(params, "page_size", nil)
    real_page_size = if page_size === nil, do: ElCloud.FileStorage.get_save_file_count(directory), else: String.to_integer(page_size)

    render(conn, "index.json", tb_files: FileStorage.list_files(directory, page, real_page_size, is_recursive))
  end

  swagger_path(:update) do
    put("/api/files")
    summary("Move file")
    description("List all files in directory")
  end
  def move_file(conn, %{"oldPath" => oldPath, "newPath" => newPath}) do
    File.rename(Path.join(@data_dir, oldPath), Path.join(@data_dir, newPath)) 
      |> send_response(conn)
  end


  swagger_path(:post) do
    PhoenixSwagger.Path.post("/api/files")
    summary("Delete file")
    description("Delete file")
  end
  def create(conn, %{"file" => file, "directory" => directory}) do
    full_path = Path.join([@data_dir, directory, file.filename])
    File.cp(file.path, Path.absname(full_path))
    render(conn, "show.json", file_storage: %{"operation" => "success"})
  end

  swagger_path(:delete) do
    PhoenixSwagger.Path.delete("/api/files")
    summary("Delete file")
    description("Delete file")
  end
  def delete(conn, %{"path" => path}) do
    Path.join(@data_dir, path) 
      |> DirectoryTreeHelper.remove_file() 
      |> send_response(conn)
  end


end
