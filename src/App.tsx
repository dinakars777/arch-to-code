import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  ReactFlow, 
  ReactFlowProvider, 
  addEdge, 
  useNodesState, 
  useEdgesState, 
  Controls, 
  Background, 
  BackgroundVariant 
} from '@xyflow/react';
import { Button, Input, Card } from '@dinakars777/react-glass-ui';
import { Play, Key, Hammer, Trash2, Upload, Download } from 'lucide-react';
import OpenAI from 'openai';
import { nodeTypes } from './nodes';
import './App.css';

const initialNodes: any[] = [];
const initialEdges: any[] = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Card style={{ minWidth: 400 }}>
        <h2 style={{marginTop: 0, marginBottom: 16}}>{title}</h2>
        {children}
        <Button variant="secondary" onClick={onClose} style={{marginTop: 16, width: '100%'}}>Close</Button>
      </Card>
    </div>
  );
};

const components = [
  { type: 'ec2', label: 'EC2 Instance', desc: 'Compute Server' },
  { type: 's3', label: 'S3 Bucket', desc: 'Object Storage' },
  { type: 'rds', label: 'RDS Postgres', desc: 'Relational Database' },
  { type: 'vpc', label: 'VPC', desc: 'Virtual Network' },
  { type: 'lambda', label: 'Lambda', desc: 'Serverless Function' },
  { type: 'iam', label: 'IAM Role', desc: 'Security Access' },
  { type: 'apigateway', label: 'API Gateway', desc: 'REST API' },
  { type: 'cloudfront', label: 'CloudFront', desc: 'CDN' },
  { type: 'dynamodb', label: 'DynamoDB', desc: 'NoSQL Database' },
  { type: 'sqs', label: 'SQS Queue', desc: 'Message Queue' },
  { type: 'sns', label: 'SNS Topic', desc: 'Pub/Sub' },
  { type: 'elasticache', label: 'ElastiCache', desc: 'Redis/Memcached' },
];

function ArchitectureBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [generating, setGenerating] = useState(false);

  // Load API key and diagram from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('arch-to-code-api-key');
    if (savedKey) setApiKey(savedKey);

    const savedDiagram = localStorage.getItem('arch-to-code-diagram');
    if (savedDiagram) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedDiagram);
        setNodes(savedNodes || []);
        setEdges(savedEdges || []);
      } catch (e) {
        console.error('Failed to load saved diagram', e);
      }
    }
  }, []);

  // Auto-save diagram to localStorage
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      localStorage.setItem('arch-to-code-diagram', JSON.stringify({ nodes, edges }));
    }
  }, [nodes, edges]);

  // Save API key to localStorage
  const saveApiKey = () => {
    localStorage.setItem('arch-to-code-api-key', apiKey);
    setApiKeyModalOpen(false);
  };

  const exportDiagram = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'architecture-diagram.json';
    a.click();
  };

  const importDiagram = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { nodes: importedNodes, edges: importedEdges } = JSON.parse(e.target?.result as string);
        setNodes(importedNodes || []);
        setEdges(importedEdges || []);
      } catch (err) {
        alert('Failed to import diagram. Invalid JSON format.');
      }
    };
    reader.readAsText(file);
  };

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', nodeLabel);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type: 'customNode',
        position,
        data: { label, type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const generateTerraform = async () => {
    if (!apiKey) {
      setApiKeyModalOpen(true);
      return;
    }

    if (nodes.length === 0) return;

    setGenerating(true);
    setGeneratedCode('Analyzing architecture diagram and planning infrastructure as code...');
    setCodeModalOpen(true);

    const graphData = {
      resources: nodes.map(n => ({ id: n.id, type: n.data.type, label: n.data.label })),
      connections: edges.map(e => ({ from: e.source, to: e.target }))
    };

    try {
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      
      const prompt = `You are a Senior DevOps Engineer. I have designed a visual cloud architecture.
      Here is the JSON representation of the graph:
      Nodes: ${JSON.stringify(graphData.resources)}
      Edges (A points to B means A depends on B or communicates with B): ${JSON.stringify(graphData.connections)}
      
      Output ONLY valid, production-ready HashiCorp Terraform (.tf) code to represent this architecture in AWS. Do not use markdown wrappers, just raw HCL code. Include logical local names and variables. Keep it concise but secure.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      });

      let content = response.choices[0].message.content || 'Error generating terraform.';
      content = content.replace(/^```(terraform)?\n|\n```$/g, '');
      setGeneratedCode(content);
      
    } catch (err: any) {
      setGeneratedCode('Error communicating with OpenAI:\n' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Library */}
      <aside className="sidebar">
        <h2><Hammer size={18} style={{ display:'inline', marginRight: 8}}/> Library</h2>
        <p style={{fontSize: '0.8rem', color: '#ccc'}}>Drag blocks into the workspace</p>
        
        {components.map((c) => (
          <div 
            key={c.type} 
            className="draggable-item"
            draggable
            onDragStart={(e) => onDragStart(e, c.type, c.label)}
          >
            <div>
              <div style={{fontWeight: 600, fontSize: '0.9rem'}}>{c.label}</div>
              <div style={{fontSize: '0.75rem', opacity: 0.7}}>{c.desc}</div>
            </div>
          </div>
        ))}

        <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <Button variant="secondary" onClick={exportDiagram} disabled={nodes.length === 0} style={{width: '100%'}}>
            <Download size={16} style={{marginRight: 6}}/> Export
          </Button>
          <label htmlFor="import-file" style={{width: '100%'}}>
            <Button variant="secondary" as="span" style={{width: '100%', cursor: 'pointer'}}>
              <Upload size={16} style={{marginRight: 6}}/> Import
            </Button>
          </label>
          <input 
            id="import-file" 
            type="file" 
            accept=".json" 
            onChange={importDiagram} 
            style={{display: 'none'}}
          />
          <Button variant="secondary" onClick={() => {
            if (confirm('Clear all nodes and edges?')) {
              setNodes([]);
              setEdges([]);
              localStorage.removeItem('arch-to-code-diagram');
            }
          }} style={{width: '100%'}}>
            <Trash2 size={16} style={{marginRight: 6}}/> Clear
          </Button>
          <Button variant="secondary" onClick={() => setApiKeyModalOpen(true)} style={{width: '100%'}}>
            <Key size={16} style={{marginRight: 6}}/> API Key
          </Button>
        </div>
      </aside>

      {/* Main Canvas Workspace */}
      <main className="main-flow" ref={reactFlowWrapper}>
        <div className="top-bar">
          <Button variant="primary" onClick={generateTerraform} disabled={generating || nodes.length === 0}>
            {generating ? 'Compiling AI...' : <><Play size={16} fill="white" style={{marginRight: 6}}/> Generate Terraform</>}
          </Button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#555" />
          <Controls />
        </ReactFlow>
      </main>

      {/* API Key Modal */}
      <Modal isOpen={apiKeyModalOpen} onClose={() => setApiKeyModalOpen(false)} title="OpenAI API Key Required">
        <p style={{marginBottom: 16, fontSize: '0.9rem'}}>To translate visual nodes into live Terraform scripts, we use OpenAI. Your key is stored locally in your browser and never sent to our servers.</p>
        <Input 
          type="password" 
          value={apiKey} 
          onChange={(e: any) => setApiKey(e.target.value)} 
          placeholder="sk-..."
          style={{marginBottom: 16}}
        />
        <Button variant="primary" onClick={saveApiKey} style={{width: '100%'}}>Save Securely</Button>
      </Modal>

      {/* Terraform Output Modal */}
      <Modal isOpen={codeModalOpen} onClose={() => setCodeModalOpen(false)} title="✨ Infrastructure as Code">
        <pre className="code-pre">
          {generatedCode}
        </pre>
        {!generating && (
          <Button variant="primary" onClick={() => {
            navigator.clipboard.writeText(generatedCode);
            alert("Copied to clipboard!");
          }} style={{marginTop: 16, width: '100%'}}>
            Copy main.tf
          </Button>
        )}
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <ArchitectureBuilder />
    </ReactFlowProvider>
  );
}
