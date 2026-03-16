import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@dinakars777/react-glass-ui';
import { Server, Database, Cloud, Network, Shield, Zap } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  ec2: <Server size={18} color="#f59e0b" />,
  rds: <Database size={18} color="#3b82f6" />,
  s3: <Cloud size={18} color="#10b981" />,
  vpc: <Network size={18} color="#8b5cf6" />,
  iam: <Shield size={18} color="#ef4444" />,
  lambda: <Zap size={18} color="#ec4899" />
};

export const CustomNode = ({ data }: any) => {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <Card variant="default">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {iconMap[data.type] || <Cloud size={18} />}
          <div className="custom-node-label">{data.label}</div>
        </div>
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export const nodeTypes = {
  customNode: CustomNode
};
