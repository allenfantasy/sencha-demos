class TasksController < ApplicationController
  def index
    @tasks = Task.all

    respond_to do |format|
      #format.html # index.html.erb
      tasks = @tasks.map { |t| t.as_json(:except => [:created_at, :updated_at]) }
      format.json { render json: { :data => tasks, :success => true } }
    end
  end

  def show
    @task = Task.find(params[:id])

    respond_to do |format|
      #format.html # show.html.erb
      format.json { render json: @task }
    end
  end

  def new
    @task = Task.new

    respond_to do |format|
      #format.html # new.html.erb
      format.json { render json: @task }
    end
  end

  def edit
    @task = Task.find(params[:id])
  end

  def create
    params[:task] = params.slice(:completed, :description, :title).merge ({
      :uuid => params[:id],
      :dueDate => DateTime.strptime(params[:dueDate].to_i.to_s, "%s"),
    })

    logger.info "PARAMS: #{params[:task]}"

    @task = Task.new(params[:task])

    respond_to do |format|
      if @task.save
        #format.html { redirect_to @task, notice: 'Task was successfully created.' }
        format.json { render json: { :id => @task.id, :success => true } }
      else
        #format.html { render action: "new" }
        format.json { render json: { :id => @task.id, :success => false } }
      end
    end
  end

  def update
    params[:task][:dueDate] = DateTime.strptime(params[:dueDate].to_i.to_s, "%s")

    @task = Task.find(params[:id])

    respond_to do |format|
      if @task.update_attributes(params[:task])
        #format.html { redirect_to @task, notice: 'Task was successfully updated.' }
        format.json { render json: { :success => true, :id => @task.id } }
      else
        #format.html { render action: "edit" }
        format.json { render json: { :success => false, :id => @task.id } }
        #format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @task = Task.find(params[:id])
    @task.destroy

    respond_to do |format|
      #format.html { redirect_to tasks_url }
      format.json { render json: { :success => true } }
    end
  end
end
