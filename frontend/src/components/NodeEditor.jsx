import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { RxCross2 } from 'react-icons/rx';
import axios from 'axios';
import toast from 'react-hot-toast';
import Logout from './Logout';

const ColdEmailNode = ({ id, data }) => {
  const handleSubjectChange = (e) => {
    data.onChange(id, {
      ...data,
      subject: e.target.value
    });
  };

  const handleBodyChange = (e) => {
    data.onChange(id, {
      ...data,
      body: e.target.value
    });
  };
  
  return (
    <div>
      <span className="flex justify-end text-xl">
        <RxCross2
          onClick={() => data.onRemove(id)}
          className="bg-slate-800 rounded-full hover:bg-slate-500"
        />
      </span>
      <div className="card bg-base-100">
        <div className="card-body">
          <h1 className="mb-2">Cold Email</h1>
          <label className="input input-bordered flex items-center gap-2">
            <input 
              type="text" 
              className="grow" 
              placeholder="Subject" 
              value={data.subject || ''}
              onChange={handleSubjectChange} 
            />
          </label>
          <textarea
            placeholder="Body"
            className="textarea textarea-bordered textarea-md w-full max-w-xs"
            value={data.body || ''}
            onChange={handleBodyChange}
          />
        </div>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    </div>
  );
};

const WaitNode = ({ id, data }) => {
  const handleDelayChange = (e) => {
    data.onChange(id, {
      ...data,
      delay: e.target.value
    });
  };

  return (
    <div>
      <span className="flex justify-end text-xl">
        <RxCross2
          onClick={() => data.onRemove(id)}
          className="bg-slate-800 rounded-full hover:bg-slate-500"
        />
      </span>
      <div className="card bg-base-100">
        <div className="card-body">
          <h1 className="mb-2">Delay (Minute)</h1>
          <label className="input input-bordered flex items-center gap-2">
            <input 
              type="text" 
              className="grow" 
              placeholder="1" 
              value={data.delay}
              onChange={handleDelayChange}
            />
          </label>
        </div>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    </div>
  );
};

const LeadSourceNode = ({ id, data }) => {
  const handleSourceChange = (e) => {
    data.onChange(id, {
      ...data,
      source: e.target.value
    });
  };

  return (
    <div>
      <span className="flex justify-end text-xl">
        <RxCross2
          onClick={() => data.onRemove(id)}
          className="bg-slate-800 rounded-full hover:bg-slate-500"
        />
      </span>
      <div className="card bg-base-100">
        <div className="card-body">
          <h1 className="mb-2">Lead Source</h1>
          <label className="input input-bordered flex items-center gap-2">
            <input 
              type="text" 
              className="grow" 
              placeholder="abc@gmail.com" 
              value={data.source || ''}
              onChange={handleSourceChange} 
            />
          </label>
        </div>
        <Handle type="source" position={Position.Bottom} />
      </div>
    </div>
  );
};

const nodeTypes = {
  coldEmail: ColdEmailNode,
  waitDelay: WaitNode,
  leadSource: LeadSourceNode,
};

const NodeEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeId, setNodeId] = useState(1);
  const [lastNodeId, setLastNodeId] = useState(null);

  const nodeSequence = ['leadSource', 'coldEmail', 'waitDelay'];
  const [currentStep, setCurrentStep] = useState(0);

  const handleNodeDataChange = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const addNode = useCallback(() => {
    if (currentStep >= nodeSequence.length) {
      alert('All steps are completed!');
      return;
    }

    const type = nodeSequence[currentStep];
    const newNodeId = `${nodeId}`;
    
    const newNode = {
      id: newNodeId,
      type,
      data: {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        onRemove: removeNode,
        onChange: handleNodeDataChange,
        // Initialize with empty values based on node type
        ...(type === 'coldEmail' && { subject: '', body: '' }),
        ...(type === 'waitDelay' && { delay: '1' }),
        ...(type === 'leadSource' && { source: '' }),
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    setNodes((nds) => [...nds, newNode]);

    if (lastNodeId !== null) {
      setEdges((eds) =>
        addEdge({ 
          id: `${lastNodeId}-${newNodeId}`, 
          source: lastNodeId, 
          target: newNodeId 
        }, eds)
      );
    }

    setLastNodeId(newNodeId);
    setNodeId((id) => id + 1);
    setCurrentStep((step) => step + 1);
  }, [currentStep, nodeId, lastNodeId, setNodes, setEdges, handleNodeDataChange]);

  const removeNode = useCallback(
    (id) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    },
    [setNodes, setEdges]
  );

  const saveFlow = async () => {
    try {
      // Now nodes contain all the updated data from components
      await axios.post('/api/flow/save', { 
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          data: {
            ...node.data,
            // Remove function references before saving
            onRemove: undefined,
            onChange: undefined
          },
          position: node.position
        }))
      });
      toast.success("Flow has been saved");
    } catch (error) {
      console.error('Error saving flow:', error);
      toast.error("Failed to save flow");
    }
  };

  const onConnect = useCallback((connection) => 
    setEdges((eds) => addEdge(connection, eds)), [setEdges]);

  return (
    <div className="h-screen w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitViewOptions={{
          padding: 20,
        }}
      >
        <Background />
      </ReactFlow>
      <div className="absolute bottom-4 left-4 space-x-2">
        <button className="btn" onClick={addNode} disabled={currentStep >= nodeSequence.length}>
          {currentStep < nodeSequence.length
            ? `Add ${nodeSequence[currentStep]}`
            : 'All Steps Completed'}
        </button>
        <button className='btn' onClick={saveFlow}>
          Save Flow
        </button>
        <button className='btn'>
          <Logout />
        </button>
      </div>
    </div>
  );
};

export default NodeEditor;