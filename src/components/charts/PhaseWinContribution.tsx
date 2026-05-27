import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import type { IPLMatch } from '../../types';
import { useMemo } from 'react';

interface PhaseWinContributionProps {
  matches: IPLMatch[];
}

export const PhaseWinContribution = ({ matches }: PhaseWinContributionProps) => {
  const chartData = useMemo(() => {
    let winPP = 0, winMid = 0, winDeath = 0;
    let losePP = 0, loseMid = 0, loseDeath = 0;

    matches.forEach(m => {
      if (!m.winner || m.winner === 'No Result') return;
      const isT1Winner = m.winner === m.innings1_team;
      if (isT1Winner) {
        winPP += Number(m.innings1_powerplay||0); winMid += Number(m.innings1_middle||0); winDeath += Number(m.innings1_death||0);
        losePP += Number(m.innings2_powerplay||0); loseMid += Number(m.innings2_middle||0); loseDeath += Number(m.innings2_death||0);
      } else {
        winPP += Number(m.innings2_powerplay||0); winMid += Number(m.innings2_middle||0); winDeath += Number(m.innings2_death||0);
        losePP += Number(m.innings1_powerplay||0); loseMid += Number(m.innings1_middle||0); loseDeath += Number(m.innings1_death||0);
      }
    });

    const advPP = Math.max(0, winPP - losePP);
    const advMid = Math.max(0, winMid - loseMid);
    const advDeath = Math.max(0, winDeath - loseDeath);
    const totalAdv = advPP + advMid + advDeath;

    if (totalAdv === 0) return [];

    return [
      { name: 'Powerplay', size: advPP, percentage: (advPP/totalAdv)*100, fill: '#FF6B35' },
      { name: 'Middle Overs', size: advMid, percentage: (advMid/totalAdv)*100, fill: '#10B981' },
      { name: 'Death Overs', size: advDeath, percentage: (advDeath/totalAdv)*100, fill: '#00D4FF' }
    ];
  }, [matches]);

  if (chartData.length === 0) return null;

  const CustomContent = (props: any) => {
    const { x, y, width, height, name, percentage, fill, payload } = props;
    const itemFill = fill || payload?.fill || '#64748B';
    const itemPercent = percentage !== undefined ? percentage : payload?.percentage;
    const itemName = name || payload?.name || '';
    
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} style={{ fill: itemFill, stroke: '#111827', strokeWidth: 2, strokeOpacity: 0.5 }} />
        {width > 50 && height > 30 && (
          <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize={14} fontWeight="bold">
            {itemName}
          </text>
        )}
        {width > 50 && height > 50 && itemPercent !== undefined && (
          <text x={x + width / 2} y={y + height / 2 + 20} textAnchor="middle" fill="#fff" fontSize={12} opacity={0.8}>
            {Number(itemPercent).toFixed(1)}%
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <h3 className="text-xl font-bold text-ipl-text mb-6">Winning Contribution By Phase</h3>
      <div className="flex-1 min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={chartData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            content={<CustomContent />}
          >
            <Tooltip 
              cursor={{ fill: 'var(--theme-border, #ffffff05)' }}
              contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }}
              formatter={(_value: any, _name: any, props: any) => [`${props.payload.percentage.toFixed(1)}%`, 'Contribution Weight']}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
