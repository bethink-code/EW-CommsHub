'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Heading1,
  Heading2,
  Heading3,
  BodyText,
  Label,
  Caption,
  Flex,
  Box,
  Input,
  TextArea,
  Toggle,
  GraphToggle,
  GraphStatusSelector,
  GraphKey,
  SelectorCard,
  GraphIndicator
} from '@/components/primitives';
import type { GraphStatusOption, GraphKeyItem, SelectorCardItem } from '@/components/primitives';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type TabId = 'typography' | 'buttons' | 'inputs' | 'colors' | 'graphs' | 'components' | 'spacing';

// Sample data for charts
const chartData = [
  { month: '60', income: 850000, expense: 650000, withdrawal: 200000 },
  { month: '65', income: 920000, expense: 680000, withdrawal: 240000 },
  { month: '70', income: 980000, expense: 710000, withdrawal: 270000 },
  { month: '75', income: 1050000, expense: 750000, withdrawal: 300000 },
  { month: '80', income: 1100000, expense: 780000, withdrawal: 320000 },
  { month: '85', income: 1150000, expense: 810000, withdrawal: 340000 },
  { month: '90', income: 1200000, expense: 840000, withdrawal: 360000 },
];

// Official Elite Wealth chart colors from ILLUSTRATIONS AND GRAPHS palette
// Primary colors (12) + Secondary colors (12) = 24 total colors
const barData = [
  { category: 'Local Equipment', value: 31.4, fill: '#09A3CE' },
  { category: 'Offshore Equity', value: 31.4, fill: '#A1DCF2' },
];

const barData10 = [
  { category: 'Local Equipment', value: 31.4, fill: '#09A3CE' },
  { category: 'Offshore Equity', value: 31.4, fill: '#A1DCF2' },
  { category: 'Local Bonds', value: 31.4, fill: '#EA8A2E' },
  { category: 'Offshore Other', value: 31.4, fill: '#F1B431' },
  { category: 'Local Cash', value: 31.4, fill: '#64519A' },
  { category: 'Offshore Cash', value: 31.4, fill: '#FAD280' },
  { category: 'Offshore Bonds', value: 31.4, fill: '#8D7BB3' },
  { category: 'Local Property', value: 31.4, fill: '#E60000' },
  { category: 'Local Other', value: 31.4, fill: '#B50012' },
  { category: 'Offshore Property', value: 31.4, fill: '#FAE9B1' },
];

// All 24 official chart colors (Primary 12 + Secondary 12)
const chartColors = [
  // Primary colors
  '#09A3CE', '#A1DCF2', '#EA8A2E', '#F1B431', '#FAD280', '#FAE9B1',
  '#64519A', '#8D7BB3', '#C1B4D1', '#D5CEE3', '#E60000', '#B50012',
  // Secondary colors
  '#016991', '#5BBAC7', '#8D7257', '#EA8A2B', '#00A4A8', '#1FCC98',
  '#AAEEE6', '#8D69B0', '#D068C1', '#1E54CD', '#799BCC', '#ACC2E1'
];

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState<TabId>('typography');

  const tabs = [
    { id: 'typography' as TabId, label: 'Typography' },
    { id: 'buttons' as TabId, label: 'Buttons' },
    { id: 'inputs' as TabId, label: 'Inputs' },
    { id: 'colors' as TabId, label: 'Colors' },
    { id: 'graphs' as TabId, label: 'Graphs' },
    { id: 'components' as TabId, label: 'Components' },
    { id: 'spacing' as TabId, label: 'Spacing' },
  ];

  return (
    <AppLayout>
      <Flex direction="column" gap="lg">
        <Box>
          <Heading1>Design System</Heading1>
          <Caption>All components use the Elite Wealth design system</Caption>
        </Box>

        {/* Tabs */}
        <Flex gap="sm" style={{ borderBottom: '2px solid #E2E8F0' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? '#016991' : '#475569',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #016991' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                marginBottom: '-2px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </Flex>

        {/* Tab Content */}
        {activeTab === 'typography' && (
          <Flex direction="column" gap="lg">
            <Card>
              <CardHeader>
                <Heading2>Typography</Heading2>
              </CardHeader>
              <CardBody>
                <Flex direction="column" gap="md">
                  <Box>
                    <Heading1>Heading 1 - 24px Semi Bold</Heading1>
                    <Heading2>Heading 2 - 20px Medium</Heading2>
                    <Heading3>Heading 3 - 18px SemiBold</Heading3>
                    <BodyText>Body Text - 14px Regular</BodyText>
                    <Label>Label - 13px Medium</Label>
                    <Caption>Caption - 12px Regular</Caption>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          </Flex>
        )}

        {activeTab === 'buttons' && (
          <Flex direction="column" gap="lg">
            <Card>
              <CardHeader>
                <Heading2>Button States</Heading2>
              </CardHeader>
              <CardBody>
                <Flex direction="column" gap="lg">
                  {/* Primary Buttons */}
                  <Box>
                    <Heading3>Primary</Heading3>
                    <Flex gap="md" style={{ marginTop: '12px', alignItems: 'flex-start' }}>
                      <Box style={{ textAlign: 'center' }}>
                        <Button variant="primary">Default</Button>
                        <Caption style={{ display: 'block', marginTop: '8px' }}>Default</Caption>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Button variant="primary" style={{ filter: 'brightness(1.1)' }}>Hover</Button>
                        <Caption style={{ display: 'block', marginTop: '8px' }}>Hover</Caption>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Button variant="primary" disabled>Disabled</Button>
                        <Caption style={{ display: 'block', marginTop: '8px' }}>Disabled</Caption>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Button variant="primary" style={{ filter: 'brightness(0.9)' }}>Pressed</Button>
                        <Caption style={{ display: 'block', marginTop: '8px' }}>Pressed</Caption>
                      </Box>
                    </Flex>
                  </Box>

                  {/* Secondary Buttons */}
                  <Box>
                    <Heading3>Secondary</Heading3>
                    <Flex gap="md" style={{ marginTop: '12px', alignItems: 'flex-start' }}>
                      <Box style={{ textAlign: 'center' }}>
                        <Button variant="secondary">Default</Button>
                        <Caption style={{ display: 'block', marginTop: '8px' }}>Default</Caption>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Button variant="secondary" style={{ filter: 'brightness(1.1)' }}>Hover</Button>
                        <Caption style={{ display: 'block', marginTop: '8px' }}>Hover</Caption>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Button variant="secondary" disabled>Disabled</Button>
                        <Caption style={{ display: 'block', marginTop: '8px' }}>Disabled</Caption>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Button variant="secondary" style={{ filter: 'brightness(0.9)' }}>Pressed</Button>
                        <Caption style={{ display: 'block', marginTop: '8px' }}>Pressed</Caption>
                      </Box>
                    </Flex>
                  </Box>

                  {/* Tertiary Buttons */}
                  <Box>
                    <Heading3>Tertiary</Heading3>
                    <Flex gap="md" style={{ marginTop: '12px', alignItems: 'flex-start' }}>
                      <Box style={{ textAlign: 'center' }}>
                        <Button variant="tertiary">Default</Button>
                        <Caption style={{ display: 'block', marginTop: '8px' }}>Default</Caption>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Button variant="tertiary" style={{ filter: 'brightness(0.95)' }}>Hover</Button>
                        <Caption style={{ display: 'block', marginTop: '8px' }}>Hover</Caption>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Button variant="tertiary" disabled>Disabled</Button>
                        <Caption style={{ display: 'block', marginTop: '8px' }}>Disabled</Caption>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Button variant="tertiary" style={{ filter: 'brightness(0.9)' }}>Pressed</Button>
                        <Caption style={{ display: 'block', marginTop: '8px' }}>Pressed</Caption>
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          </Flex>
        )}

        {activeTab === 'inputs' && (
          <Flex direction="column" gap="lg">
            <Card>
              <CardHeader>
                <Heading2>Input Fields</Heading2>
              </CardHeader>
              <CardBody>
                <Flex direction="column" gap="lg">
                  <Box>
                    <Heading3>Input States</Heading3>
                    <Flex direction="column" gap="md" style={{ marginTop: '12px', maxWidth: '400px' }}>
                      <Input
                        label="Default Input"
                        placeholder="Enter text..."
                        helperText="This is helper text"
                      />
                      <Input
                        label="Filled Input"
                        value="Some text value"
                        readOnly
                      />
                      <Input
                        label="Error State"
                        placeholder="Enter email..."
                        errorMessage="This field is required"
                      />
                      <Input
                        label="Success State"
                        value="valid@email.com"
                        isSuccess
                        readOnly
                      />
                      <Input
                        label="Disabled Input"
                        placeholder="Cannot edit"
                        disabled
                      />
                    </Flex>
                  </Box>

                  <Box>
                    <Heading3>Text Area</Heading3>
                    <Box style={{ marginTop: '12px', maxWidth: '400px' }}>
                      <TextArea
                        label="Description"
                        placeholder="Enter a description..."
                        helperText="Maximum 500 characters"
                        rows={4}
                      />
                    </Box>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          </Flex>
        )}

        {activeTab === 'colors' && (
          <Flex direction="column" gap="lg">
            <Card>
              <CardHeader>
                <Heading2>Color Palette</Heading2>
              </CardHeader>
              <CardBody>
                <Flex direction="column" gap="lg">
                  {/* Primary Colors */}
                  <Box>
                    <Heading3>Primary Colors</Heading3>
                    <Flex gap="sm" style={{ flexWrap: 'wrap', marginTop: '12px' }}>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <Box key={num} style={{ textAlign: 'center' }}>
                          <div style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: `var(--ew-primary-${num})`,
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }} />
                          <Caption style={{ display: 'block', marginTop: '4px' }}>primary-{num}</Caption>
                        </Box>
                      ))}
                    </Flex>
                  </Box>

                  {/* Secondary Colors */}
                  <Box>
                    <Heading3>Secondary Colors</Heading3>
                    <Flex gap="sm" style={{ flexWrap: 'wrap', marginTop: '12px' }}>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <Box key={num} style={{ textAlign: 'center' }}>
                          <Box style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: `var(--ew-secondary-${num})`,
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }} />
                          <Caption style={{ display: 'block', marginTop: '4px' }}>secondary-{num}</Caption>
                        </Box>
                      ))}
                    </Flex>
                  </Box>

                  {/* Neutral Colors */}
                  <Box>
                    <Heading3>Neutral Colors</Heading3>
                    <Flex gap="sm" style={{ flexWrap: 'wrap', marginTop: '12px' }}>
                      {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                        <Box key={num} style={{ textAlign: 'center' }}>
                          <Box style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: `var(--ew-neutral-${num})`,
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }} />
                          <Caption style={{ display: 'block', marginTop: '4px' }}>neutral-{num}</Caption>
                        </Box>
                      ))}
                    </Flex>
                  </Box>

                  {/* Semantic Colors */}
                  <Box>
                    <Heading3>Semantic Colors</Heading3>
                    <Flex gap="md" style={{ flexWrap: 'wrap', marginTop: '12px' }}>
                      <Box style={{ textAlign: 'center' }}>
                        <Box style={{ width: '100px', height: '80px', backgroundColor: 'var(--ew-success)', borderRadius: '8px' }} />
                        <Caption style={{ display: 'block', marginTop: '4px' }}>Success</Caption>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Box style={{ width: '100px', height: '80px', backgroundColor: 'var(--ew-error)', borderRadius: '8px' }} />
                        <Caption style={{ display: 'block', marginTop: '4px' }}>Error</Caption>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Box style={{ width: '100px', height: '80px', backgroundColor: 'var(--ew-warning)', borderRadius: '8px' }} />
                        <Caption style={{ display: 'block', marginTop: '4px' }}>Warning</Caption>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Box style={{ width: '100px', height: '80px', backgroundColor: 'var(--ew-info)', borderRadius: '8px' }} />
                        <Caption style={{ display: 'block', marginTop: '4px' }}>Info</Caption>
                      </Box>
                    </Flex>
                  </Box>

                  {/* Chart Colors (23 colors) */}
                  <Box>
                    <Heading3>Chart Colors (23 colors)</Heading3>
                    <Caption style={{ display: 'block', marginTop: '4px', marginBottom: '12px' }}>
                      Used for graphs, charts, and data visualizations
                    </Caption>
                    <Flex gap="xs" style={{ flexWrap: 'wrap', marginTop: '12px' }}>
                      {chartColors.map((color, idx) => (
                        <Box key={idx} style={{ textAlign: 'center' }}>
                          <Box style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: color,
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0'
                          }} />
                          <Caption style={{ display: 'block', marginTop: '2px', fontSize: '9px' }}>Chart {idx + 1}</Caption>
                        </Box>
                      ))}
                    </Flex>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          </Flex>
        )}

        {activeTab === 'graphs' && (
          <Flex direction="column" gap="lg">
            {/* Area Charts */}
            <Card>
              <CardHeader>
                <Heading2>Area Charts</Heading2>
                <Caption>Trend visualization with layered data in all 6 color themes</Caption>
              </CardHeader>
              <CardBody>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                  {/* Blue Theme */}
                  <Box>
                    <Label style={{ display: 'block', marginBottom: '12px' }}>Blue Theme</Label>
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="blueGradient1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#016991" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#016991" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="blueGradient2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4FB1D6" stopOpacity={0.6}/>
                            <stop offset="100%" stopColor="#4FB1D6" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="month" style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <YAxis style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                        <Area type="monotone" dataKey="income" stackId="1" stroke="#016991" strokeWidth={2} fill="url(#blueGradient1)" />
                        <Area type="monotone" dataKey="expense" stackId="1" stroke="#4FB1D6" strokeWidth={2} fill="url(#blueGradient2)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>

                  {/* Purple Theme */}
                  <Box>
                    <Label style={{ display: 'block', marginBottom: '12px' }}>Purple Theme</Label>
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="purpleGradient1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="purpleGradient2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#C4B5FD" stopOpacity={0.6}/>
                            <stop offset="100%" stopColor="#C4B5FD" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="month" style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <YAxis style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                        <Area type="monotone" dataKey="income" stackId="1" stroke="#8B5CF6" strokeWidth={2} fill="url(#purpleGradient1)" />
                        <Area type="monotone" dataKey="expense" stackId="1" stroke="#C4B5FD" strokeWidth={2} fill="url(#purpleGradient2)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>

                  {/* Green Theme */}
                  <Box>
                    <Label style={{ display: 'block', marginBottom: '12px' }}>Green Theme</Label>
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="greenGradient1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#10B981" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="greenGradient2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6EE7B7" stopOpacity={0.6}/>
                            <stop offset="100%" stopColor="#6EE7B7" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="month" style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <YAxis style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                        <Area type="monotone" dataKey="income" stackId="1" stroke="#10B981" strokeWidth={2} fill="url(#greenGradient1)" />
                        <Area type="monotone" dataKey="expense" stackId="1" stroke="#6EE7B7" strokeWidth={2} fill="url(#greenGradient2)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>

                  {/* Teal Theme */}
                  <Box>
                    <Label style={{ display: 'block', marginBottom: '12px' }}>Teal Theme</Label>
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="tealGradient1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0891B2" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#0891B2" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="tealGradient2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#67E8F9" stopOpacity={0.6}/>
                            <stop offset="100%" stopColor="#67E8F9" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="month" style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <YAxis style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                        <Area type="monotone" dataKey="income" stackId="1" stroke="#0891B2" strokeWidth={2} fill="url(#tealGradient1)" />
                        <Area type="monotone" dataKey="expense" stackId="1" stroke="#67E8F9" strokeWidth={2} fill="url(#tealGradient2)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>

                  {/* Orange Theme */}
                  <Box>
                    <Label style={{ display: 'block', marginBottom: '12px' }}>Orange Theme</Label>
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="orangeGradient1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EA8A2E" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#EA8A2E" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="orangeGradient2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FED7AA" stopOpacity={0.6}/>
                            <stop offset="100%" stopColor="#FED7AA" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="month" style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <YAxis style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                        <Area type="monotone" dataKey="income" stackId="1" stroke="#EA8A2E" strokeWidth={2} fill="url(#orangeGradient1)" />
                        <Area type="monotone" dataKey="expense" stackId="1" stroke="#FED7AA" strokeWidth={2} fill="url(#orangeGradient2)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>

                  {/* Indigo Theme */}
                  <Box>
                    <Label style={{ display: 'block', marginBottom: '12px' }}>Indigo Theme</Label>
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="indigoGradient1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="indigoGradient2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#A5B4FC" stopOpacity={0.6}/>
                            <stop offset="100%" stopColor="#A5B4FC" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="month" style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <YAxis style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                        <Area type="monotone" dataKey="income" stackId="1" stroke="#4F46E5" strokeWidth={2} fill="url(#indigoGradient1)" />
                        <Area type="monotone" dataKey="expense" stackId="1" stroke="#A5B4FC" strokeWidth={2} fill="url(#indigoGradient2)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </div>
              </CardBody>
            </Card>

            {/* Line Charts */}
            <Card>
              <CardHeader>
                <Heading2>Line Charts</Heading2>
                <Caption>Time-series and trend analysis in all 6 color themes</Caption>
              </CardHeader>
              <CardBody>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                  {/* Blue Theme */}
                  <Box>
                    <Label style={{ display: 'block', marginBottom: '12px' }}>Blue Theme</Label>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="month" style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <YAxis style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                        <Line type="monotone" dataKey="income" stroke="#016991" strokeWidth={3} dot={{ fill: '#016991', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                        <Line type="monotone" dataKey="expense" stroke="#4FB1D6" strokeWidth={3} dot={{ fill: '#4FB1D6', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>

                  {/* Purple Theme */}
                  <Box>
                    <Label style={{ display: 'block', marginBottom: '12px' }}>Purple Theme</Label>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="month" style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <YAxis style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                        <Line type="monotone" dataKey="income" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                        <Line type="monotone" dataKey="expense" stroke="#C4B5FD" strokeWidth={3} dot={{ fill: '#C4B5FD', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>

                  {/* Green Theme */}
                  <Box>
                    <Label style={{ display: 'block', marginBottom: '12px' }}>Green Theme</Label>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="month" style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <YAxis style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                        <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                        <Line type="monotone" dataKey="expense" stroke="#6EE7B7" strokeWidth={3} dot={{ fill: '#6EE7B7', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>

                  {/* Teal Theme */}
                  <Box>
                    <Label style={{ display: 'block', marginBottom: '12px' }}>Teal Theme</Label>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="month" style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <YAxis style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                        <Line type="monotone" dataKey="income" stroke="#0891B2" strokeWidth={3} dot={{ fill: '#0891B2', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                        <Line type="monotone" dataKey="expense" stroke="#67E8F9" strokeWidth={3} dot={{ fill: '#67E8F9', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>

                  {/* Orange Theme */}
                  <Box>
                    <Label style={{ display: 'block', marginBottom: '12px' }}>Orange Theme</Label>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="month" style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <YAxis style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                        <Line type="monotone" dataKey="income" stroke="#EA8A2E" strokeWidth={3} dot={{ fill: '#EA8A2E', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                        <Line type="monotone" dataKey="expense" stroke="#FED7AA" strokeWidth={3} dot={{ fill: '#FED7AA', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>

                  {/* Indigo Theme */}
                  <Box>
                    <Label style={{ display: 'block', marginBottom: '12px' }}>Indigo Theme</Label>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="month" style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <YAxis style={{ fontSize: '12px', fontFamily: 'Inter' }} stroke="#64748B" tick={{ fill: '#64748B' }} />
                        <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                        <Line type="monotone" dataKey="income" stroke="#4F46E5" strokeWidth={3} dot={{ fill: '#4F46E5', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                        <Line type="monotone" dataKey="expense" stroke="#A5B4FC" strokeWidth={3} dot={{ fill: '#A5B4FC', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </div>
              </CardBody>
            </Card>

            {/* Bar Charts (2-bar) */}
            <Card>
              <CardHeader>
                <Heading2>Bar Charts (2-bar)</Heading2>
                <Caption>Simple comparisons using multiple colors from the 23-color palette</Caption>
              </CardHeader>
              <CardBody>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                  {/* Multi-color */}
                  <Box>
                    <Label style={{ display: 'block', marginBottom: '12px' }}>Multi-Color Palette</Label>
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={barData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis type="number" style={{ fontSize: '12px' }} stroke="#64748B" />
                        <YAxis type="category" dataKey="category" width={120} style={{ fontSize: '12px' }} stroke="#64748B" />
                        <Tooltip />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {barData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>

                </div>
              </CardBody>
            </Card>

            {/* Bar Charts (10-bar) */}
            <Card>
              <CardHeader>
                <Heading2>Bar Charts (10-bar)</Heading2>
                <Caption>Complex multi-category comparisons using multiple colors from the 23-color palette</Caption>
              </CardHeader>
              <CardBody>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                  {/* Multi-color Example */}
                  <Box>
                    <Label style={{ display: 'block', marginBottom: '12px' }}>Multi-Color Palette (Each bar uses a different color)</Label>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={barData10} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis type="number" style={{ fontSize: '11px' }} stroke="#64748B" />
                        <YAxis type="category" dataKey="category" width={120} style={{ fontSize: '11px' }} stroke="#64748B" />
                        <Tooltip />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {barData10.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </div>
              </CardBody>
            </Card>

            {/* Graph Interactive Elements */}
            <Card>
              <CardHeader>
                <Heading2>Graph Interactive Elements</Heading2>
                <Caption>Interactive components and indicators for graph controls</Caption>
              </CardHeader>
              <CardBody>
                <Flex direction="column" gap="lg">
                  {/* Toggle Switches */}
                  <Box>
                    <Heading3>Toggle Switches</Heading3>
                    <Caption style={{ display: 'block', marginTop: '4px', marginBottom: '16px' }}>
                      Various toggle switch layouts for graph controls
                    </Caption>
                    <Flex gap="lg" style={{ flexWrap: 'wrap' }}>
                      <Box style={{ border: '1px dashed #E2E8F0', padding: '20px', borderRadius: '8px' }}>
                        <Label style={{ display: 'block', marginBottom: '12px' }}>Single Toggle</Label>
                        <Toggle checked={true} onChange={() => {}} />
                      </Box>

                      <Box style={{ border: '1px dashed #E2E8F0', padding: '20px', borderRadius: '8px' }}>
                        <Label style={{ display: 'block', marginBottom: '12px' }}>Toggle with Labels</Label>
                        <GraphToggle checked={false} onChange={() => {}} leftLabel="Real" rightLabel="Nominal" variant="labeled" />
                      </Box>

                      <Box style={{ border: '1px dashed #E2E8F0', padding: '20px', borderRadius: '8px' }}>
                        <Label style={{ display: 'block', marginBottom: '12px' }}>Toggle with Center Label</Label>
                        <GraphToggle checked={true} onChange={() => {}} centerLabel="Income" variant="centered" />
                      </Box>
                    </Flex>
                  </Box>

                  {/* Status Selectors */}
                  <Box>
                    <Heading3>Status Selectors</Heading3>
                    <Caption style={{ display: 'block', marginTop: '4px', marginBottom: '16px' }}>
                      Radio-style selectors for switching between data views
                    </Caption>
                    <Flex gap="lg" style={{ flexWrap: 'wrap' }}>
                      <Box style={{ border: '1px dashed #E2E8F0', padding: '20px', borderRadius: '8px' }}>
                        <Label style={{ display: 'block', marginBottom: '12px' }}>Horizontal Layout</Label>
                        <GraphStatusSelector
                          options={[
                            { value: 'real', label: 'Real', color: '#016991' },
                            { value: 'nominal', label: 'Nominal', color: '#09A3CE' },
                          ]}
                          value="real"
                          onChange={() => {}}
                          layout="horizontal"
                        />
                      </Box>

                      <Box style={{ border: '1px dashed #E2E8F0', padding: '20px', borderRadius: '8px' }}>
                        <Label style={{ display: 'block', marginBottom: '12px' }}>Vertical Layout</Label>
                        <GraphStatusSelector
                          options={[
                            { value: 'nominal', label: 'Nominal' },
                            { value: 'real', label: 'Real' },
                          ]}
                          value="nominal"
                          onChange={() => {}}
                          layout="vertical"
                        />
                      </Box>
                    </Flex>
                  </Box>

                  {/* Graph Keys / Legends */}
                  <Box>
                    <Heading3>Graph Keys & Legends</Heading3>
                    <Caption style={{ display: 'block', marginTop: '4px', marginBottom: '16px' }}>
                      Legend displays for identifying data series
                    </Caption>
                    <Flex direction="column" gap="md">
                      <Box style={{ border: '1px dashed #E2E8F0', padding: '20px', borderRadius: '8px' }}>
                        <Label style={{ display: 'block', marginBottom: '12px' }}>Simple Legend</Label>
                        <GraphKey
                          items={[
                            { label: 'Income', color: '#016991' },
                            { label: 'Expenses', color: '#09A3CE' },
                            { label: 'Required withdraw from voluntary investments', color: '#D068C1' },
                          ]}
                          variant="simple"
                        />
                      </Box>

                      <Box style={{ border: '1px dashed #E2E8F0', padding: '20px', borderRadius: '8px' }}>
                        <Label style={{ display: 'block', marginBottom: '12px' }}>Interactive Legend with Toggles</Label>
                        <GraphKey
                          items={[
                            { label: 'Income', color: '#016991', checked: true },
                            { label: 'Expenses', color: '#09A3CE', checked: true },
                            { label: 'Withdrawal', color: '#D068C1', checked: false },
                          ]}
                          variant="interactive"
                          showToggles={true}
                          onToggle={(index) => console.log('Toggled:', index)}
                        />
                      </Box>
                    </Flex>
                  </Box>

                  {/* Selector Cards */}
                  <Box>
                    <Heading3>Selector Cards</Heading3>
                    <Caption style={{ display: 'block', marginTop: '4px', marginBottom: '16px' }}>
                      Data display cards for showing values on charts
                    </Caption>
                    <Flex gap="lg" style={{ flexWrap: 'wrap' }}>
                      <Box style={{ border: '1px dashed #E2E8F0', padding: '20px', borderRadius: '8px' }}>
                        <Label style={{ display: 'block', marginBottom: '12px' }}>Simple Card</Label>
                        <SelectorCard
                          items={[
                            { label: 'Retirement funds (Nominal)', value: 'R XXX,XXX.00', color: '#016991' },
                            { label: 'Retirement funds (Real)', value: 'R XXX,XXX.00', color: '#09A3CE' },
                          ]}
                        />
                      </Box>

                      <Box style={{ border: '1px dashed #E2E8F0', padding: '20px', borderRadius: '8px' }}>
                        <Label style={{ display: 'block', marginBottom: '12px' }}>Card with Multiple Items</Label>
                        <SelectorCard
                          items={[
                            { label: 'Income', value: 'R XXX,XXX.00', color: '#016991' },
                            { label: 'Expense', value: 'R XXX,XXX.00', color: '#09A3CE' },
                            { label: 'Withdrawal', value: 'R XXX,XXX.00', color: '#EA8A2E' },
                          ]}
                        />
                      </Box>
                    </Flex>
                  </Box>

                  {/* Graph Indicators */}
                  <Box>
                    <Heading3>Graph Indicators</Heading3>
                    <Caption style={{ display: 'block', marginTop: '4px', marginBottom: '16px' }}>
                      Vertical line with circle marker for highlighting data points
                    </Caption>
                    <Box style={{ border: '1px dashed #E2E8F0', padding: '20px', borderRadius: '8px', position: 'relative', height: '150px' }}>
                      <Label style={{ display: 'block', marginBottom: '12px' }}>Indicator Example</Label>
                      <div style={{ position: 'relative', height: '100px', background: '#F8FAFC', borderRadius: '4px' }}>
                        <GraphIndicator x={100} y={40} color="#016991" showLine={true} showCircle={true} label="74" />
                      </div>
                    </Box>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          </Flex>
        )}

        {activeTab === 'components' && (
          <Flex direction="column" gap="lg">
            {/* Badges */}
            <Card>
              <CardHeader>
                <Heading2>Badges</Heading2>
              </CardHeader>
              <CardBody>
                <Flex gap="md" style={{ flexWrap: 'wrap' }}>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                </Flex>
              </CardBody>
            </Card>

            {/* Cards */}
            <Card>
              <CardHeader>
                <Heading2>Cards</Heading2>
              </CardHeader>
              <CardBody>
                <Flex gap="md" style={{ flexWrap: 'wrap' }}>
                  <Card style={{ width: '250px' }}>
                    <CardHeader>
                      <Heading3>Card Title</Heading3>
                    </CardHeader>
                    <CardBody>
                      <BodyText>This is a card with header and body.</BodyText>
                    </CardBody>
                  </Card>

                  <Card style={{ width: '250px' }}>
                    <CardBody>
                      <Heading3>Simple Card</Heading3>
                      <BodyText>Just body content, no header.</BodyText>
                    </CardBody>
                  </Card>
                </Flex>
              </CardBody>
            </Card>

            {/* States */}
            <Card>
              <CardHeader>
                <Heading2>States</Heading2>
              </CardHeader>
              <CardBody>
                <Flex direction="column" gap="lg">
                  <Box>
                    <Heading3>Symbol States</Heading3>
                    <Flex gap="lg" style={{ marginTop: '12px' }}>
                      <Box style={{ textAlign: 'center' }}>
                        <Box style={{
                          width: '140px',
                          height: '140px',
                          backgroundColor: '#4B3F72',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </Box>
                        <Caption style={{ display: 'block', marginTop: '8px' }}>Neutral</Caption>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Box style={{
                          width: '140px',
                          height: '140px',
                          backgroundColor: 'var(--ew-success)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </Box>
                        <Caption style={{ display: 'block', marginTop: '8px' }}>Positive</Caption>
                      </Box>
                      <Box style={{ textAlign: 'center' }}>
                        <Box style={{
                          width: '140px',
                          height: '140px',
                          backgroundColor: '#FFE8E8',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </Box>
                        <Caption style={{ display: 'block', marginTop: '8px' }}>Negative</Caption>
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          </Flex>
        )}

        {activeTab === 'spacing' && (
          <Flex direction="column" gap="lg">
            <Card>
              <CardHeader>
                <Heading2>Spacing Scale</Heading2>
              </CardHeader>
              <CardBody>
                <Flex direction="column" gap="sm">
                  <Flex align="center" gap="md">
                    <Box style={{ width: '4px', height: '20px', backgroundColor: 'var(--ew-primary-7)' }} />
                    <Caption>xs - 4px</Caption>
                  </Flex>
                  <Flex align="center" gap="md">
                    <Box style={{ width: '8px', height: '20px', backgroundColor: 'var(--ew-primary-7)' }} />
                    <Caption>sm - 8px</Caption>
                  </Flex>
                  <Flex align="center" gap="md">
                    <Box style={{ width: '16px', height: '20px', backgroundColor: 'var(--ew-primary-7)' }} />
                    <Caption>base - 16px</Caption>
                  </Flex>
                  <Flex align="center" gap="md">
                    <Box style={{ width: '24px', height: '20px', backgroundColor: 'var(--ew-primary-7)' }} />
                    <Caption>md - 24px</Caption>
                  </Flex>
                  <Flex align="center" gap="md">
                    <Box style={{ width: '32px', height: '20px', backgroundColor: 'var(--ew-primary-7)' }} />
                    <Caption>lg - 32px</Caption>
                  </Flex>
                </Flex>
              </CardBody>
            </Card>
          </Flex>
        )}
      </Flex>
    </AppLayout>
  );
}
