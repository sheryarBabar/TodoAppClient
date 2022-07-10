import React, { FC, useState, useEffect, FormEvent, MouseEvent, SyntheticEvent } from 'react';
import './Todo.css';

enum Status { Pending = "Pending", Completed = "Completed" }

interface ITodoState {
    name: string,
    description: string,
    status: Status,
    uuid: string
}

const Todo: FC = () => {
    const [state, setState] = useState<ITodoState[]>([])
    const [todoPayload, setTodoPayload] = useState<ITodoState>({} as ITodoState)

    useEffect(() => {
        if (state.length < 1) {
            // ideally this should be a separate service or a custom hook
            fetch('http://localhost:5000/api/task')
                .then(response => response.json())
                .then(res => {
                    setState(res.data)
                }, error => {
                    throw new Error("Server didn't respond", { cause: error.message })
                })
                .catch(err => {
                    console.error('Server Error', err + ' ' + err.cause)
                })
        }
    }, [state])
    const submitForm = (e: SyntheticEvent) => {
        fetch('http://localhost:5000/api/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todoPayload)
        })
            .then(response => response.json())
            .then(res => {
                setState(res.data)
            }, error => {
                throw new Error("Server Error", { cause: error.message })
            })
            .catch(err => {
                console.error('Adding Task Failed', err + ' ' + err.cause)
            })

    }
    const handleChange = (e: FormEvent<HTMLInputElement>) => {
        const todoPayloadCopy = { ...todoPayload }
        const eventData = e.target as HTMLInputElement
        if (eventData.name === 'name') {
            todoPayloadCopy.name = eventData.value
        }
        if (eventData.name === 'description') {
            todoPayloadCopy.description = eventData.value
        }
        todoPayloadCopy.status = Status.Pending
        setTodoPayload(todoPayloadCopy)
    }
    const handleStatusChange = (e: MouseEvent, idx: number) => {
        const selectededTodo: ITodoState = state.find((_, i) => i === idx) as unknown as any
        const { status, uuid } = selectededTodo
        const statusPayload: any = {}
        if (status === Status.Completed) {
            statusPayload.status = Status.Pending
        }
        if (status === Status.Pending) {
            statusPayload.status = Status.Completed
        }
        fetch(`http://localhost:5000/api/task/${uuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(statusPayload)
        })
            .then(response => response.json())
            .then(res => {
                // Extracting records that are not updated from state
                const mutatedState = state.filter(s => s.uuid !== res.data.uuid)
                const updatedState = [...mutatedState, res.data]
                setState(updatedState)
            }, error => {
                throw new Error("Server Error", { cause: error.message })
            })
            .catch(err => {
                console.error('Status Change Failed', err + ' ' + err.cause)
            })

    }
    return (
        <div className="container mt-3">
            <div className="col-md-8">
                <h2>My Todos</h2>
                <div className="row">
                    <form className="form1" onSubmit={submitForm}>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-floating mb-3 mt-3">
                                    <input type="text" className="form-control" placeholder="Enter name" id="name" name="name" onChange={handleChange} />
                                    <label htmlFor="name">Name</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-floating mb-3 mt-3">
                                    <input type="text" className="form-control" placeholder="Enter description" id="description" name="description" onChange={handleChange} />
                                    <label htmlFor="description">Description</label>
                                </div>
                            </div>
                            <div className="col-md-4 mt-3">
                                <button type="submit" className="btn btn-primary btnheight">Add Todo</button>
                            </div>
                        </div>
                    </form>
                </div>
                <hr />
                {state.length > 0 ? state.map((s, idx) => {
                    return <div className="row mb-1" key={idx}>
                        <div className="list">
                            <div className="row">
                                <div className="col-md-7">
                                    <div className="form-floating mb-3 mt-3">
                                        <h2 className="task">{s.name}</h2>
                                        <p className="description">{s.description}</p>
                                    </div>
                                </div>
                                <div className="col-md-5 mb-3 mt-3">
                                    <label className="badge bg-primary">{s.status}</label>
                                    <button type="submit" className="btn btn-info" onClick={(e) => handleStatusChange(e, idx)}>Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }) : null}
            </div>
        </div>

    );
}

export default Todo;
